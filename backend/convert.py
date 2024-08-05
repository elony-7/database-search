import json
import os

# Define the input and output file paths
input_file = os.path.join('data', 'samples.txt')
output_file = os.path.join('data', 'samples.json')

# Print paths for debugging
print(f"Input file path: {input_file}")
print(f"Output file path: {output_file}")

# Check if input file exists
if not os.path.isfile(input_file):
    print(f"Error: The file {input_file} does not exist or is not a file.")
    exit(1)

# Ensure the output directory exists
output_dir = os.path.dirname(output_file)
if not os.path.isdir(output_dir):
    print(f"Error: The directory {output_dir} does not exist.")
    exit(1)

# Initialize an empty list to hold all user data
data_list = []

# Read the input file and parse the data
try:
    with open(input_file, 'r') as file:
        for line in file:
            # Strip any leading/trailing whitespace
            line = line.strip()
            
            # Split by first colon to get the URL type and the rest
            first_colon_index = line.find(':')
            if first_colon_index != -1:
                url_type = line[:first_colon_index].strip()
                remaining = line[first_colon_index + 1:].strip()
                
                # Split by second colon to get the URL and the rest
                second_colon_index = remaining.find(':')
                if second_colon_index != -1:
                    url = remaining[:second_colon_index].strip()
                    username_password = remaining[second_colon_index + 1:].strip()
                    
                    # Split by the remaining colon to separate username and password
                    third_colon_index = username_password.find(':')
                    if third_colon_index != -1:
                        username = username_password[:third_colon_index].strip()
                        password = username_password[third_colon_index + 1:].strip()
                        
                        # Create a dictionary for the current user
                        user_data = {
                            'url type': url_type,
                            'url': url,
                            'username': username,
                            'password': password
                        }
                        # Add the dictionary to the list
                        data_list.append(user_data)
                    else:
                        print(f"Malformed line (missing third colon for username/password): {line}")
                else:
                    print(f"Malformed line (missing second colon for URL): {line}")
            else:
                print(f"Malformed line (missing first colon for URL type): {line}")

except FileNotFoundError:
    print(f"Error: The file {input_file} does not exist.")
except IOError as e:
    print(f"Error: An IOError occurred: {e}")

# Write the parsed data to the output JSON file
try:
    with open(output_file, 'w') as file:
        json.dump(data_list, file, indent=4)
    print(f"Data successfully converted to {output_file}")
except IOError as e:
    print(f"Error: An IOError occurred while writing to {output_file}: {e}")
