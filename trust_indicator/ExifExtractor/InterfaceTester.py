import os
import sys

from PIL import Image, ExifTags

def create_google_maps_url(lat, lon, lat_ref, lon_ref):
    """Converts GPS coordinates to a Google Maps URL."""
    lat_decimal = convert_to_decimal_degrees(lat, lat_ref)
    lon_decimal = convert_to_decimal_degrees(lon, lon_ref)
    return f"https://maps.google.com/?q={lat_decimal},{lon_decimal}"

def convert_to_decimal_degrees(coords, direction):
    """Converts DMS (degree, minute, second) to decimal degrees."""
    degree, minutes, seconds = coords
    decimal_degrees = degree + (minutes / 60.0) + (seconds / 3600.0)
    if direction in ['S', 'W']:
        decimal_degrees = -decimal_degrees
    return decimal_degrees

def extract_exif_data(image_path):
    """Extracts EXIF data from an image and returns it as a dictionary."""
    try:
        with Image.open(image_path) as image:
            exif_data = image._getexif()
            if not exif_data:
                return None

            exif_dict = {}
            gps_coords = {}
            for tag, value in exif_data.items():
                tag_name = ExifTags.TAGS.get(tag, tag)
                if tag_name == "GPSInfo":
                    for key, val in value.items():
                        gps_tag = ExifTags.GPSTAGS.get(key, key)
                        exif_dict[gps_tag]=val
                        gps_coords[gps_tag] = val
                else:
                    exif_dict[tag_name] = value

            if 'GPSLatitude' in gps_coords and 'GPSLongitude' in gps_coords:
                url = create_google_maps_url(
                    gps_coords['GPSLatitude'],
                    gps_coords['GPSLongitude'],
                    gps_coords.get('GPSLatitudeRef', 'N'),
                    gps_coords.get('GPSLongitudeRef', 'E')
                )
                print(url)
            return exif_dict
    except IOError:
        print(f"{image_path}: Unsupported format or corrupt file.")
        return None

# Determines the current working directory and constructs the path
# to the images directory where the image files are supposed to be located.
# cwd = os.getcwd()
# image_dir = os.path.join(cwd, "images")

# if not os.path.exists(image_dir) or not os.listdir(image_dir):
#     print("The ./images folder is empty or does not exist.")
#     sys.exit()

# os.chdir(image_dir)
# files = os.listdir()

# for file in files:
#     exif_data = extract_exif_data(file)
#     if exif_data:
#         print(f"{'_' * 20}{file}{'_' * 20}")
#         for tag_name, value in exif_data.items():
#             print(f"{tag_name} - {value}")
#         if 'GPSLatitude' in exif_data and 'GPSLongitude' in exif_data:
#             url = create_google_maps_url(
#                 exif_data['GPSLatitude'],
#                 exif_data['GPSLongitude'],
#                 exif_data.get('GPSLatitudeRef', 'N'),
#                 exif_data.get('GPSLongitudeRef', 'E')
#             )
#             print(url)
#     else:
#         print(f"{file} contains no EXIF data.")
#
# os.chdir(cwd)
