from flask_sqlalchemy import SQLAlchemy
import os
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    UserName = db.Column(db.String(80),  nullable=False)
    Email = db.Column(db.String(120), unique=True, nullable=False)
    Password = db.Column(db.String(100))
    LegalName = db.Column(db.String(100))
    ProfilePhotoNO = db.Column(db.String(100))
    Is_Admin = db.Column(db.Boolean, default=False)
    images = db.relationship('Image', backref='user', lazy=True)


class Metadata(db.Model):
    __tablename__ = 'Metadata'
    ImageID = db.Column(db.Integer, primary_key=True)
    File_Size = db.Column(db.Integer)
    File_Type = db.Column(db.Text)
    MIME_Type = db.Column(db.Text)
    Create_Date = db.Column(db.Text)
    Modify_Date = db.Column(db.Text)
    Color_Space = db.Column(db.Text)
    Make = db.Column(db.Text)
    Model = db.Column(db.Text)
    Lens = db.Column(db.Text)
    Focal_Length = db.Column(db.REAL)
    Aperture = db.Column(db.REAL)
    Exposure = db.Column(db.REAL)
    ISO = db.Column(db.Integer)
    Flash = db.Column(db.Text)
    Altitude = db.Column(db.REAL)
    Latitude = db.Column(db.REAL)
    Longitude = db.Column(db.REAL)
    Software = db.Column(db.Text)

class EFMigrationsHistory(db.Model):
    __tablename__ = '_EFMigrationsHistory'
    MigrationId = db.Column(db.Text, primary_key=True)
    ProductVersion = db.Column(db.Text)

class Favorites(db.Model):
    __tablename__ = 'Favorites'
    RecordID = db.Column(db.Integer, primary_key=True)
    ImageID = db.Column(db.Integer)
    UserID = db.Column(db.Integer)
    Rate = db.Column(db.Integer)
    Is_Favorite = db.Column(db.Integer)
    Comment = db.Column(db.Text)
    Create_Date = db.Column(db.Text)

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(150))
    data = db.Column(db.LargeBinary)  # 用于存储图片的二进制数据
    user_email = db.Column(db.String(120), db.ForeignKey('user.Email'), nullable=False)
    ImageTitle = db.Column(db.Text)
    ImageDescription = db.Column(db.Text)
    UploadDate = db.Column(db.Text)
    Tag = db.Column(db.Text)

def create_database(app):
    """Create SQLite database if it doesn't exist."""
    if not os.path.exists('mydatabase.db'):
        with app.app_context():
            # db.init_app(app)
            db.create_all()
        print("Database created!")