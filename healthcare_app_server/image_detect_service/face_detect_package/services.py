import os.path
import numpy as np
import cv2
from healthcare_app_server.models import *

class FaceDetectService:

    base_path = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_path, "models/res10_300x300_ssd_iter_140000_fp16.caffemodel")
    config_path = os.path.join(base_path, "models/deploy.prototxt")
    net: cv2.dnn.Net = cv2.dnn.readNetFromCaffe(config_path, model_path)

    def __init__(self, face_image):
        self.face_image = face_image

    def get_net(self):
        return self.net

    def detect_face(self) -> str:
        image_array = np.asarray(bytearray(self.face_image), dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if image is None:
            raise RuntimeError("Image can't be decoded")

        (h, w) = image.shape[:2]

        blob = cv2.dnn.blobFromImage(image, scalefactor = 1.0, size = (300, 300), mean = (104.0, 177.0, 123.0))
        self.get_net().setInput(blob)
        detections = self.get_net().forward()

        face_data = []

        for i in range(detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence >= 0.8:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (x1, y1, x2, y2) = box.astype("int")
                face_data.append(f"{x1},{y1},{x2},{y2}")

        if len(face_data) == 0:
            print("No face detected")
            return "No Detect"
        elif len(face_data) > 1:
            print("Must be 1 face in image")
            return "Multiple Face"

        face_data_str = face_data[0]

        if self.__check_user__(face_data_str):
            return "Exist User"
        else:
            return face_data_str

    def __check_user__(self, face_data_str: str):
        # Get all users
        users = User.objects.all()

        # Check the user have same as face_data detect
        for user in users:
            if user.face_detect_data == face_data_str:
                return True
        return False

    def get_user_info(self) -> any:
        return None
