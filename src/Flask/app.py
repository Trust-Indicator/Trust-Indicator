from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os

from database import db, create_database, User
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

import re



app = Flask(__name__)
# Creat SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///MyDatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
create_database(app)

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



if __name__ == '__main__':
    app.run()


