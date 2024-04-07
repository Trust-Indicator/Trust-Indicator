# Setup Instruction:
# Enter the following in terminal, then manually import PIL package
# python3 -m pip install --upgrade pip
# python3 -m pip install --upgrade Pillow
# pip install Pillow moviepy
# pip install eyed3

import os
import sys
from PIL import Image, ExifTags


# Create a Google Maps URL from GPS coordinates
# This function takes GPS coordinates (lat, lon) and their respective references (lat_ref, lon_ref)
# to calculate the decimal degrees and returns a Google Maps URL string that points to the given location.
def create_google_maps_url(lat, lon, lat_ref, lon_ref):
    """Converts GPS coordinates to a Google Maps URL."""
    lat_decimal = convert_to_decimal_degrees(lat, lat_ref)
    lon_decimal = convert_to_decimal_degrees(lon, lon_ref)
    return f"https://maps.google.com/?q={lat_decimal},{lon_decimal}"


# Converts GPS coordinates from Degrees, Minutes, and Seconds (DMS) format to decimal degrees.
# It takes a tuple of coordinates (coords) and a direction (direction) as arguments.
# The direction is used to determine if the decimal degree should be negative,
# which is the case for South and West directions.
def convert_to_decimal_degrees(coords, direction):
    """Converts DMS (degree, minute, second) to decimal degrees."""
    degree, minutes, seconds = coords
    decimal_degrees = degree + (minutes / 60.0) + (seconds / 3600.0)
    if direction in ['S', 'W']:
        decimal_degrees = -decimal_degrees
    return decimal_degrees


# Prompts the user to choose the output method for the extracted EXIF data:
# either write it to a file ("1") or print it to the terminal ("2").
output_choice = None
while output_choice not in ["1", "2"]:
    output_choice = input("Output method:\n1 - File\n2 - Terminal\nEnter choice: ")
    if output_choice == "1":
        sys.stdout = open("exif_data.txt", "w")
    elif output_choice not in ["1", "2"]:
        print("Invalid option, please try again.")

# Determines the current working directory and constructs the path
# to the images directory where the image files are supposed to be located.
cwd = os.getcwd()
image_dir = os.path.join(cwd, "images")
# Checks if the images directory exists and contains files. If not, the script prints a message and exits.
if not os.path.exists(image_dir) or not os.listdir(image_dir):
    print("The ./images folder is empty or does not exist.")
    sys.exit()

# Changes the current working directory to the images directory and lists all files in it.
os.chdir(image_dir)
files = os.listdir()

for file in files:
    try:
        # Opens an image file using Pillow.
        with Image.open(file) as image:
            print(f"{'_' * 63}{file}{'_' * 63}")

            # Retrieves the EXIF data from the image.
            exif_data = image._getexif()
            if not exif_data:
                print(f"{file} contains no EXIF data.")
                continue

            gps_coords = {}

            # Iterates over the EXIF data.
            # It attempts to translate EXIF tags to human-readable tags using ExifTags.TAGS.
            for tag, value in exif_data.items():
                tag_name = ExifTags.TAGS.get(tag, tag)

                # Checks if the current tag is the GPS information tag.
                # If it is, iterate over the GPS information,
                # attempting to translate GPS tags to human-readable tags, and collects GPS coordinates into gps_coords.
                if tag_name == "GPSInfo":
                    for key, val in value.items():
                        gps_tag = ExifTags.GPSTAGS.get(key, key)
                        print(f"{gps_tag} - {val}")
                        gps_coords[gps_tag] = val
                else:
                    print(f"{tag_name} - {value}")

            # If GPS latitude and longitude are present in gps_coords,
            # it generates a Google Maps URL using these coordinates.
            if 'GPSLatitude' in gps_coords and 'GPSLongitude' in gps_coords:
                url = create_google_maps_url(
                    gps_coords['GPSLatitude'],
                    gps_coords['GPSLongitude'],
                    gps_coords.get('GPSLatitudeRef', 'N'),
                    gps_coords.get('GPSLongitudeRef', 'E')
                )
                print(url)
    except IOError:
        print(f"{file}: Unsupported format or corrupt file.")

if output_choice == "1":
    sys.stdout.close()
os.chdir(cwd)
