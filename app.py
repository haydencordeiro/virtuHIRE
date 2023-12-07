from flask import Flask, request, jsonify
import face_recognition
import numpy as np
from PIL import Image, ImageOps
import io
from flask import Flask, request, jsonify, send_file
from pymongo.mongo_client import MongoClient

# MongoDB connection settings
username = "acc_real_estate"
database_name = "virtuhire"
collection_name = "leaderboard"
uri = "mongodb+srv://"+username+":U3RulWV4my1egCRp@cluster0.tdacs3z.mongodb.net/?retryWrites=true&w=majority"

app = Flask(__name__)

# Variable to store the known face encoding
known_encoding = None

@app.route('/first_image', methods=['POST'])
def intialize_face():
    global known_encoding

    # Check if the request contains a file
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    # Check if the file is empty
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Read the image file and convert it to an RGB array
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB format if not already in RGB
        if image.mode != 'RGB':
            image = ImageOps.exif_transpose(image.convert('RGB'))

        image_array = np.array(image)
        print(face_recognition.face_encodings(image_array))
        known_encoding = face_recognition.face_encodings(image_array)[0]

        return jsonify({'result': 'First image set as known face'}), 200
    except Exception as e:
            print(e)
            return jsonify({'result': str(e)}), 200

        

@app.route('/recognize', methods=['POST'])
def recognize_face():
    global known_encoding

    # Check if the request contains a file
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    # Check if the file is empty
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Read the image file and convert it to an RGB array
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB format if not already in RGB
        if image.mode != 'RGB':
            image = ImageOps.exif_transpose(image.convert('RGB'))

        image_array = np.array(image)

        if known_encoding is None:
            # If this is the first image, set it as the known face
            known_encoding = face_recognition.face_encodings(image_array)[0]
            return jsonify({'result': 'First image set as known face'}), 200
        else:
            # Perform face recognition
            face_locations = face_recognition.face_locations(image_array)
            face_encodings = face_recognition.face_encodings(image_array, face_locations)

            if len(face_locations) > 1:
                return jsonify({'result': 'Not allowed to have multiple people in the frame'}), 200

            # Compare face encodings
            is_known_person = face_recognition.compare_faces([known_encoding], face_encodings[0])[0]
            if is_known_person:
                is_known_person = 'Same Person'
            else:
                is_known_person = 'Different Person'

            return jsonify({'result': is_known_person }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/get_all_candidates', methods=['GET'])
def get_all_candidates():
    # Create a new client and connect to the server
    client = MongoClient(uri)

    # Connect to MongoDB
    database = client[database_name]
    collection = database[collection_name]

    # Retrieve all documents from the collection
    all_candidates = list(collection.find({}, {"_id": 0}).sort("score", -1))

    # Close the MongoDB connection
    client.close()

    return jsonify({"candidates": all_candidates})


if __name__ == '__main__':
    app.run(debug=True)
