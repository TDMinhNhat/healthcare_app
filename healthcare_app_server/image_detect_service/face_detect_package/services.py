import numpy as np
import cv2
import dlib

def auth_face_detect(face_image) -> int:
    image_array = np.asarray(bytearray(face_image), dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        raise RuntimeError("Image can't be decoded")

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    detector = dlib.get_frontal_face_detector()
    faces = detector(rgb_image)

    if len(faces) == 0:
        print("No face detected")
        return 0
    elif len(faces) > 1:
        print("Multiple faces detected")
        return -1

    return 1