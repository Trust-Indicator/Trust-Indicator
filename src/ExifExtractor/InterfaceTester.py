import os
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

def extract_exif_data_as_dict(image_path):
    """Extracts EXIF data from an image file and returns it as a dictionary."""
    try:
        with Image.open(image_path) as image:
            exif_data = image._getexif()
            if not exif_data:
                return None

            exif_dict = {}
            for tag, value in exif_data.items():
                tag_name = ExifTags.TAGS.get(tag, tag)
                exif_dict[tag_name] = value

            return exif_dict
    except IOError:
        print(f"Error opening or processing file {image_path}")
        return None

# Example usage
cwd = os.getcwd()
image_dir = os.path.join(cwd, "images")
if not os.path.exists(image_dir) or not os.listdir(image_dir):
    print("The ./images folder is empty or does not exist.")
else:
    os.chdir(image_dir)
    files = os.listdir()

    # Assuming other parts of the script remain unchanged

    for file in files:
        exif_data = extract_exif_data_as_dict(file)
        if exif_data:
            print(f"EXIF data for {file}:")
            for key, value in exif_data.items():
                print(f"{key}: {value}")

            # Check if GPS information is available
            gps_info = exif_data.get('GPSInfo')
            if gps_info:
                # Extract GPSLatitude, GPSLongitude, and their references
                gps_latitude = gps_info.get('GPSLatitude')
                gps_longitude = gps_info.get('GPSLongitude')
                gps_latitude_ref = gps_info.get('GPSLatitudeRef')
                gps_longitude_ref = gps_info.get('GPSLongitudeRef')

                # Check if we have all necessary GPS information
                if gps_latitude and gps_longitude and gps_latitude_ref and gps_longitude_ref:
                    url = create_google_maps_url(
                        gps_latitude,
                        gps_longitude,
                        gps_latitude_ref,
                        gps_longitude_ref
                    )
                    print(f"Google Maps URL: {url}")
        else:
            print(f"{file} contains no EXIF data or could not be processed.")

