from flask import Flask, render_template, jsonify, request
from database import db, create_database, User
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
import re

from flask_login import LoginManager, login_user

app = Flask(__name__)
# Creat SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///MyDatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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

if __name__ == '__main__':
    app.run()


