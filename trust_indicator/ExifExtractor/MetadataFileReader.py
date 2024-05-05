# This file is used for converting metadata into Dictionary data structure
# Format: metadata tag: metadata value
metadata_dict = {}

with open('exif_data.txt', 'r') as file:
    for line in file:

        if line.strip().startswith('___'):
            continue


        key_value = line.split('-')
        if len(key_value) == 2:
            key = key_value[0].strip()
            value = key_value[1].strip()


            try:

                if value.startswith('(') and value.endswith(')'):
                    value = eval(value)

                elif '.' in value:
                    value = float(value)
                else:
                    value = int(value)
            except:
                pass

            metadata_dict[key] = value

for key, value in metadata_dict.items():
    print(f"{key}: {value}")
