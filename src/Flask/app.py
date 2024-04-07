import os
from datetime import datetime
from io import BytesIO
import random
import jwt

from flask import Flask, render_template, request, flash, redirect, url_for, jsonify, send_file, session
from requests import Session
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from src.ExifExtractor.InterfaceTester import extract_exif_data

from database import db, create_database, User, Image, Feedback
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
import re
from flask_session import Session
from flask_login import LoginManager, login_user, current_user, login_required, logout_user
from datetime import datetime, timedelta
from flask_mail import Mail, Message
from flask import render_template

app = Flask(__name__)
# Creat SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///MyDatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'jpg', 'jpeg'}
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = 'filesystem'
app.config["SESSION_FILE_DIR"] = "./flask_session_cache"
# Email Server
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'trustindicator@gmail.com'
app.config['MAIL_PASSWORD'] = 'vfiz hsgw ctke tdeu'

mail = Mail(app)
Session(app)

app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=0)
db.init_app(app)
create_database(app)

# Flask-Login配置
app.secret_key = 'COMP8715'
login_manager = LoginManager()
login_manager.init_app(app)


@app.before_request
def make_session_not_permanent():
    session.permanent = False


@app.route('/')
def index():
    return render_template('html/index.html')


@app.route('/signup')
def signup():
    return render_template('html/signup.html')


@app.route('/upload')
def upload():
    return render_template('html/upload.html')


@app.route('/login')
def login():
    return render_template('html/login.html')


@app.route('/userprofile')
@login_required
def userprofile():
    return render_template('html/userprofile.html', user=current_user)

@app.route('/whatwedo')
def whatwedo():
    return render_template('html/whatwedo.html')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/changepassword')
def changepassword():
    return render_template('html/changepassword.html')


@app.route('/analysis')
def analysis():
    return render_template('html/analysis.html')


@app.route('/logout')
def logout():
    session.clear()
    logout_user()
    return render_template('html/index.html')


@app.route('/feedback')
def GoToFeedback():
    source = request.args.get('source', '')
    return render_template('html/feedback.html', source=source)


@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    if data:
        name = data.get('name')
        email = data.get('email')
        feedback_type = data.get('feedback-type')
        content = data.get('feedback')

        new_feedback = Feedback(name=name, email=email, date=datetime.utcnow(), feedback_type=feedback_type,
                                content=content)
        db.session.add(new_feedback)
        db.session.commit()

        rendered_html = render_template('html/feedback_confirmation.html',
                                        name=name,
                                        feedback_type=feedback_type,
                                        year=datetime.now().year
                                        )

        msg = Message("We Received Your Feedback",
                      sender="Trust-Indicator",
                      recipients=[email])

        msg.body = "Your email verification code is provided in the HTML part of this email."
        msg.html = rendered_html
        mail.send(msg)
        return jsonify({"status": "success",
                        "message": "Thank you for your feedback. A confirmation email has been sent to you."}), 200
    return jsonify({"status": "error", "message": "Error, please try again."}), 400


def generate_token(email, code):
    payload = {
        'email': email,
        'code': code,
        'exp': datetime.utcnow() + timedelta(minutes=10)
    }
    token = jwt.encode(payload, 'your_secret_key', algorithm='HS256')
    return token


@app.route('/send-code', methods=['POST'])
def send_code():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "Email address is required."}), 400

    code = ''.join([str(random.randint(0, 9)) for _ in range(4)])
    token = generate_token(email, code)

    msg = Message("Your Verification Code",
                  sender="Trust-Indicator",
                  recipients=[email])

    rendered_html = render_template(
        'html/verification_email.html',
        code=code,
        year=datetime.now().year
    )
    msg.body = "Your email verification code is provided in the HTML part of this email."
    msg.html = rendered_html
    mail.send(msg)

    return jsonify({"message": "Verification code sent.", "token": token})


@app.route('/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    token = data.get('token')
    user_code = data.get('code')

    try:
        decoded = jwt.decode(token, 'your_secret_key', algorithms=['HS256'])
        if decoded.get('code') == user_code:
            return jsonify({"message": "Verification successful.", "status": "success"}), 200
        else:
            return jsonify({"message": "Verification failed. The code does not match."}), 400
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 400


@app.route('/gallery')
def GotoGallery():
    user_email = current_user.UserName if current_user.is_authenticated else 'Welcome'
    return render_template('html/gallery.html', user_email=user_email)


# signup function
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('UserName')
    email = data.get('Email')
    legal_name = data.get('LegalName')
    password = data.get('Password')

    email_regex = r'(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)'
    if not re.match(email_regex, email):
        return jsonify({'message': 'Invalid email format.'}), 400
    password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,12}$'
    if not re.match(password_regex, password):
        return jsonify({'message': 'Password does not meet requirements.'}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    # add to database
    new_user = User(UserName=username, Email=email, LegalName=legal_name, Password=hashed_password,
                    ProfilePhotoNO=str(random.randint(1, 3)))
    db.session.add(new_user)
    print('username:', username, 'email:', email)
    try:
        db.session.commit()
        return jsonify({'message': 'User registered successfully.'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Email already exists.'}), 400


# change password
@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'No data provided.'}), 403

    email = data['email']
    old_password = data['old-password']
    new_password = data['new-password']
    confirm_new_password = data['confirm-new-password']

    user = User.query.filter_by(Email=email).first()

    if user and check_password_hash(user.Password, old_password):
        if new_password == confirm_new_password:
            user.Password = generate_password_hash(new_password)
            db.session.commit()
            return jsonify(
                {'status': 'success', 'message': 'Password updated successfully.', 'redirect': url_for('login')}), 200
        else:
            return jsonify({'status': 'invalid', 'message': 'New passwords do not match.'}), 400
    else:
        return jsonify({'status': 'error', 'message': 'Incorrect email or password.'}), 401


@app.route('/reset-password', methods=['POST'])
def reset_password():
    email = request.json.get('email')
    new_password = request.json.get('newPassword')

    user = User.query.filter_by(Email=email).first()
    if user:
        if user.Password != generate_password_hash(new_password):
            password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,12}$'
            if not re.match(password_regex, new_password):
                return jsonify({'status': 'error',
                                'message': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'}), 401
            user.Password = generate_password_hash(new_password)
            db.session.commit()
            return jsonify({'status': 'success', 'message': 'Password has been updated successfully.'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Need a new password.'}), 500
    else:
        return jsonify({'status': 'error', 'message': 'User not found.'}), 404


# log in function
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/login_function', methods=['POST'])
def login_function():
    # 从请求中获取数据
    data = request.get_json()
    username_or_email = data.get('username')
    password = data.get('password')

    # 查询数据库中的用户
    user = User.query.filter((User.UserName == username_or_email) | (User.Email == username_or_email)).first()

    # 验证密码并登录用户
    if user and check_password_hash(user.Password, password):
        login_user(user)
        return jsonify({'message': 'Logged in successfully'}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401


@app.route('/uploadImage', methods=['POST'])
@login_required
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify(error="No file part"), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify(error="No selected file"), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_data = file.read()
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            # Here we use current_user.email to get the email of the logged-in user
            # new_image = Image(filename=filename, data=file_data, user_email=current_user.Email)
            # upload_time = datetime.utcnow()
            #
            # db.session.add(new_image)
            # db.session.commit()
            image_data_io = BytesIO(file_data)
            file_size = len(file_data)
            file_type = file.content_type
            original_filename = file.filename
            exif_data = extract_exif_data(image_data_io)
            if exif_data:
                with open("exif_data.txt", "w") as file:
                    for key, value in exif_data.items():
                        file.write(f"{key}: {value}\n")
                colorSpace = exif_data.get('ColorSpace')
                datetime_original = exif_data.get('DateTime')
                make = exif_data.get('Make')
                model = exif_data.get('Model')
                focal_length = exif_data.get('FocalLength')
                if focal_length:
                    if hasattr(focal_length, 'numerator') and hasattr(focal_length, 'denominator'):
                        focal_length_value = float(focal_length.numerator) / float(focal_length.denominator)
                    else:
                        focal_length_value = float(focal_length)
                else:
                    focal_length_value = None
                aperture = exif_data.get('ApertureValue')
                if aperture:
                    if hasattr(aperture, 'numerator') and hasattr(aperture, 'denominator'):
                        aperture_length_value = float(aperture.numerator) / float(aperture.denominator)
                    else:
                        aperture_length_value = float(aperture)
                else:
                    aperture_length_value = None
                exposure = exif_data.get('ExposureProgram')
                if exposure:
                    if hasattr(exposure, 'numerator') and hasattr(exposure, 'denominator'):
                        exposure_length_value = float(exposure.numerator) / float(exposure.denominator)
                    else:
                        exposure_length_value = float(exposure)
                else:
                    exposure_length_value = None
                iso = exif_data.get('ISOSpeedRatings')
                if iso:
                    if hasattr(iso, 'numerator') and hasattr(iso, 'denominator'):
                        iso_length_value = float(iso.numerator) / float(iso.denominator)
                    else:
                        iso_length_value = float(iso)
                else:
                    iso_length_value = None

                flash = exif_data.get('Flash')
                if flash:
                    if hasattr(flash, 'numerator') and hasattr(flash, 'denominator'):
                        flash_length_value = float(flash.numerator) / float(flash.denominator)
                    else:
                        flash_length_value = float(flash)
                else:
                    flash_length_value = None

                image_width = exif_data.get('ExifImageWidth')
                if image_width:
                    if hasattr(image_width, 'numerator') and hasattr(image_width, 'denominator'):
                        image_width = float(image_width.numerator) / float(image_width.denominator)
                    else:
                        image_width = float(image_width)
                else:
                    image_width = None

                image_length = exif_data.get('ExifImageHeight')
                if image_length:
                    if hasattr(image_length, 'numerator') and hasattr(image_length, 'denominator'):
                        image_length = float(image_length.numerator) / float(image_length.denominator)
                    else:
                        image_length = float(image_length)
                else:
                    image_length = None

                altitude = exif_data.get('GPSAltitude')
                if altitude:
                    if hasattr(altitude, 'numerator') and hasattr(altitude, 'denominator'):
                        altitude = float(altitude.numerator) / float(altitude.denominator)
                    else:
                        altitude = float(altitude)
                else:
                    altitude = None

                latitudeRef = exif_data.get('GPSLatitudeRef')
                latitude = exif_data.get('GPSLatitude')
                if isinstance(latitude, tuple) and len(latitude) == 3:
                    latitude = format_latitude(latitude)
                else:
                    latitude = None

                longitudeRef = exif_data.get('GPSLongitudeRef')
                longitude = exif_data.get('GPSLongitude')
                if isinstance(longitude, tuple) and len(longitude) == 3:
                    longitude = format_latitude(longitude)
                else:
                    longitude = None

                metadata = {
                    'ColorSpace': colorSpace if colorSpace else 'None',
                    'Created': datetime_original if datetime_original else 'None',
                    'Make': make if make else 'None',
                    'Model': model if model else 'None',
                    'FocalLength': focal_length_value if focal_length_value is not None else 'None',
                    'Aperture': aperture_length_value if aperture_length_value is not None else 'None',
                    'Exposure': exposure_length_value if exposure_length_value is not None else 'None',
                    'ISO': iso_length_value if iso_length_value is not None else 'None',
                    'Flash': flash_length_value if flash_length_value is not None else 'None',
                    'ImageWidth': image_width if image_width is not None else 'None',
                    'ImageLength': image_length if image_length is not None else 'None',
                    'Altitude': altitude if altitude is not None else 'None',
                    'LatitudeRef': latitudeRef if latitudeRef is not None else 'None',
                    'Latitude': latitude if latitude is not None else 'None',
                    'LongitudeRef': longitudeRef if longitudeRef is not None else 'None',
                    'Longitude': longitude if longitude is not None else 'None',
                }
                upload_time = datetime.utcnow()
                new_image = Image(
                    filename=filename,
                    data=file_data,
                    user_email=current_user.Email,
                    UploadDate=upload_time,  # Save the upload time
                    ColorSpace=colorSpace if colorSpace else 'None',
                    Created=datetime_original if datetime_original else 'None',
                    Make=make if make else 'None',
                    Model=model if model else 'None',
                    FocalLength=focal_length_value,
                    Aperture=aperture_length_value,
                    Exposure=exposure_length_value,
                    ISO=iso_length_value,
                    Flash=flash_length_value,
                    ImageWidth=image_width,
                    ImageLength=image_length,
                    Altitude=altitude,
                    LatitudeRef=latitudeRef if latitudeRef else 'None',
                    Latitude=latitude,
                    LongitudeRef=longitudeRef if longitudeRef else 'None',
                    Longitude=longitude,
                    # Add other metadata fields as necessary
                )

                db.session.add(new_image)
                db.session.commit()

                return jsonify({
                    'message': 'Image successfully uploaded',
                    'filename': original_filename,
                    'file_size': file_size,
                    'file_type': file_type,
                    'metadata': metadata,
                    'id': new_image.id
                })
            else:
                metadata = {
                    'ColorSpace': 'unidentifiable',
                    'Created': 'unidentifiable',
                    'Make': 'unidentifiable',
                    'Model': 'unidentifiable',
                    'FocalLength': 'unidentifiable',
                    'Aperture': 'unidentifiable',
                    'Exposure': 'unidentifiable',
                    'ISO': 'unidentifiable',
                    'Flash': 'unidentifiable',
                    'ImageWidth': 'unidentifiable',
                    'ImageLength': 'unidentifiable',
                    'Altitude': 'unidentifiable',
                    'LatitudeRef': 'None',
                    'Latitude': 'None',
                    'LongitudeRef': 'None',
                    'Longitude': 'None',
                }

                upload_time = datetime.utcnow()
                new_image = Image(
                    filename=filename,
                    data=file_data,
                    user_email=current_user.Email,
                    UploadDate=upload_time,  # Save the upload time
                    ColorSpace=None,
                    Created=None,
                    Make=None,
                    Model=None,
                    FocalLength=None,
                    Aperture=None,
                    Exposure=None,
                    ISO=None,
                    Flash=None,
                    ImageWidth=None,
                    ImageLength=None,
                    Altitude=None,
                    LatitudeRef=None,
                    Latitude=None,
                    LongitudeRef=None,
                    Longitude=None,
                    # Add other metadata fields as necessary
                )

                db.session.add(new_image)
                db.session.commit()
                return jsonify({
                    'message': 'Image successfully uploaded',
                    'filename': original_filename,
                    'file_size': file_size,
                    'file_type': file_type,
                    'metadata': metadata,
                    'id': new_image.id
                })

        else:
            return jsonify(error="Allowed file types are: png, jpg, jpeg, gif"), 400


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


def format_latitude(latitude):
    degrees, minutes, seconds = latitude
    return f"{degrees}° {minutes}' {seconds}\""


@app.route('/image/<int:image_id>')
def get_image(image_id):
    image = Image.query.get(image_id)
    if image and image.data:
        return send_file(
            BytesIO(image.data),
            mimetype='image/jpeg',  # or 'image/png' etc depending on your image type
            as_attachment=True,
            download_name=image.filename
        )
    else:
        os.abort(404)


@app.route('/getcurrentuserimages')
def get_current_user_images():
    user_email = current_user.Email

    images = Image.query.filter_by(user_email=user_email).all()
    image_info = [{'id': image.id, 'filename': image.filename} for image in images]
    return jsonify(image_info)


@app.route('/getimages')
def get_images():
    images = Image.query.all()
    image_info = [{'id': image.id, 'filename': image.filename} for image in images]
    print(image_info)
    return jsonify(image_info)


@app.route('/updateImageType', methods=['POST'])
@login_required
def update_image_type():
    image_id = request.form['imageId']
    image_type = request.form['imageType']
    session['image_id_for_analysis'] = image_id

    image = Image.query.get(image_id)
    if image:
        image.Tag = image_type
        db.session.commit()
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'failed'})


@app.route('/getImage')
def get_image_for_analysis():
    # Get the image id from the user session
    image_id = session.get('image_id_for_analysis')

    if image_id:
        image = Image.query.get(image_id)
        if image and image.data:
            return send_file(BytesIO(image.data), download_name=image.filename,
                             mimetype='image/jpeg')  # Or the correct MIME type for the image
        else:
            return 'Image not found', 404
    else:
        return 'No image ID provided', 400


@app.route('/change_profile_photo', methods=['POST'])
@login_required
def change_profile_photo():
    selected_image_number = request.form.get('selected_image')
    if selected_image_number:
        try:
            selected_image_number = int(selected_image_number)
        except ValueError:
            return jsonify({'status': 'error', 'message': 'Invalid image number.'}), 400

        if 1 <= selected_image_number <= 16:
            user = User.query.get(current_user.id)
            if user:
                user.ProfilePhotoNO = selected_image_number
                db.session.commit()
                return jsonify({'status': 'success', 'message': 'Profile photo updated successfully.'}), 200
            else:
                return jsonify({'status': 'error', 'message': 'User not found'}), 404
        else:
            return jsonify({'status': 'error', 'message': 'Image number out of range.'}), 400
    return jsonify({'status': 'error', 'message': 'No image selected.'}), 400


@app.route('/get_current_user', methods=['GET'])
def get_current_user():
    if current_user and current_user.is_authenticated:
        user_info = {
            'name': current_user.LegalName,
            'email': current_user.Email
        }
    else:
        user_info = {
            'name': "",
            'email': ""
        }
    return jsonify(user_info), 200


if __name__ == '__main__':
    app.run()
