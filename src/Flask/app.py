from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
import os

from database import db, create_database, User



app = Flask(__name__)
# Creat SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///MyDatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
# create_database(app)

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



if __name__ == '__main__':
    app.run()


