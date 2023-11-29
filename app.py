from flask import Flask, request, jsonify
import face_recognition
import numpy as np
from PIL import Image, ImageOps
import io

app = Flask(__name__)

# Load a known face encoding (replace with your known image)
known_image_path = "image1.png"
known_image = face_recognition.load_image_file(known_image_path)
known_encoding = face_recognition.face_encodings(known_image)[0]

@app.route('/recognize', methods=['POST'])
def recognize_face():
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

        # Perform face recognition
        unknown_encoding = face_recognition.face_encodings(image_array)
        if not unknown_encoding:
            return jsonify({'result': 'No face found in the provided image'}), 200

        # Compare face encodings
        results = face_recognition.compare_faces([known_encoding], unknown_encoding[0])

        # Check the result
        if results[0]:
            return jsonify({'result': 'The provided image contains the known person'}), 200
        else:
            return jsonify({'result': 'The provided image does not appear to contain the same person'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
