import face_recognition
import numpy as np



# Load the first image
image1 = face_recognition.load_image_file("image1.png")
encoding1 = face_recognition.face_encodings(image1)

# Load the second image
image2 = face_recognition.load_image_file("image3.jpg")
encoding2 = face_recognition.face_encodings(image2)

# Check if there is at least one face in each image
if len(encoding1) == 0 or len(encoding2) == 0:
    print("No face found in one of the images.")
else:
    # Convert the lists of encodings to numpy arrays
    encoding1 = np.array(encoding1)
    encoding2 = np.array(encoding2)

    # Compare face encodings
    results = face_recognition.compare_faces(encoding1, encoding2)

    # Check the results
    if any(results):
        print("The images contain at least one common person.")
    else:
        print("The images do not appear to contain the same person.")
