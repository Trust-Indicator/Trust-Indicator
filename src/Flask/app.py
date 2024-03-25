import os
from io import BytesIO

from flask import Flask, render_template, jsonify, request
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from src.ExifExtractor.InterfaceTester import extract_exif_data_as_dict

from database import db, create_database, User, Image
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
import re

from flask_login import LoginManager, login_user, current_user, login_required

app = Flask(__name__)
# Creat SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///MyDatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'  # 保存图片的目录
app.config['ALLOWED_EXTENSIONS'] = {'jpg', 'jpeg'}
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db.init_app(app)
create_database(app)


# Flask-Login配置
app.secret_key = 'COMP8715'
login_manager = LoginManager()
login_manager.init_app(app)

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

@app.route('/changepassword')
def changepassword():
    return render_template('html/changepassword.html')



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
    new_user = User(UserName=username, Email=email, LegalName=legal_name, Password=hashed_password,)
    db.session.add(new_user)
    print('username:', username, 'email:', email)
    try:
        db.session.commit()
        return jsonify({'message': 'User registered successfully.'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Email already exists.'}), 400


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


@app.route('/uploadImage',methods=['POST'])
@login_required  # Ensure that the user must be logged in to access this route
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
            new_image = Image(filename=filename, data=file_data, user_email=current_user.Email)
            db.session.add(new_image)
            db.session.commit()
            image_data_io = BytesIO(file_data)
            file_size = len(file_data)
            file_type = file.content_type
            original_filename = file.filename
            exif_data = extract_exif_data_as_dict(image_data_io)
            if exif_data:
                with open("exif_data.txt", "w") as file:
                    for key, value in exif_data.items():
                        file.write(f"{key}: {value}\n")
                colorSpace = exif_data.get('ColorSpace')
                datetime_original = exif_data.get('DateTimeOriginal')
                make = exif_data.get('Make')
                model = exif_data.get('Model')
                focal_length = exif_data.get('FocalLength')
                if focal_length:
                    if hasattr(focal_length, 'numerator') and hasattr(focal_length, 'denominator'):
                        focal_length_value = float(focal_length.numerator) / float(focal_length.denominator)
                    else:
                        focal_length_value = float(focal_length)
                else:
                    focal_length_value = 'None'
                aperture = exif_data.get('ApertureValue')
                if aperture:
                    if hasattr(aperture, 'numerator') and hasattr(aperture, 'denominator'):
                        aperture_length_value = float(aperture.numerator) / float(aperture.denominator)
                    else:
                        aperture_length_value = float(aperture)
                else:
                    aperture_length_value = 'None'
                exposure = exif_data.get('ExposureProgram')
                if exposure:
                    if hasattr(exposure, 'numerator') and hasattr(exposure, 'denominator'):
                        exposure_length_value = float(exposure.numerator) / float(exposure.denominator)
                    else:
                        exposure_length_value = float(exposure)
                else:
                    exposure_length_value = 'None'
                iso = exif_data.get('ISOSpeedRatings')
                if iso:
                    if hasattr(iso, 'numerator') and hasattr(iso, 'denominator'):
                        iso_length_value = float(iso.numerator) / float(iso.denominator)
                    else:
                        iso_length_value = float(iso)
                else:
                    iso_length_value = 'None'

                flash = exif_data.get('Flash')
                if flash:
                    if hasattr(flash, 'numerator') and hasattr(flash, 'denominator'):
                        flash_length_value = float(flash.numerator) / float(flash.denominator)
                    else:
                        flash_length_value = float(flash)
                else:
                    flash_length_value = 'None'

                image_width = exif_data.get('ExifImageWidth')
                if image_width:
                    if hasattr(image_width, 'numerator') and hasattr(image_width, 'denominator'):
                        image_width = float(image_width.numerator) / float(image_width.denominator)
                    else:
                        image_width = float(image_width)
                else:
                    image_width = 'None'

                image_length = exif_data.get('ExifImageHeight')
                if image_length:
                    if hasattr(image_length, 'numerator') and hasattr(image_length, 'denominator'):
                        image_length = float(image_length.numerator) / float(image_length.denominator)
                    else:
                        image_length = float(image_length)
                else:
                    image_length = 'None'
                metadata = {
                    'ColorSpace': colorSpace if colorSpace else 'None',
                    'Created': datetime_original if datetime_original else 'None',
                    'Make': make if make else 'None',
                    'Model': model if model else 'None',
                    'FocalLength': focal_length_value,
                    'Aperture': aperture_length_value,
                    'Exposure': exposure_length_value,
                    'ISO': iso_length_value,
                    'Flash': flash_length_value,
                    'ImageWidth': image_width,
                    'ImageLength': image_length,
                }

                return jsonify({
                    'message': 'Image successfully uploaded',
                    'filename': original_filename,
                    'file_size': file_size,
                    'file_type': file_type,
                    'metadata': metadata,
                })

        else:
            return jsonify(error="Allowed file types are: png, jpg, jpeg, gif"), 400

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


if __name__ == '__main__':
    app.run()


