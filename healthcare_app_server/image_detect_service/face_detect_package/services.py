import os.path
import numpy as np
import cv2
from healthcare_app_server.models import *
from scipy.spatial.distance import cosine

class FaceDetectService:

    base_path = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_path, "models/res10_300x300_ssd_iter_140000_fp16.caffemodel")
    config_path = os.path.join(base_path, "models/deploy.prototxt")
    descriptor_path = os.path.join(base_path, "models/openface.nn4.small2.v1.t7")

    net: cv2.dnn.Net = cv2.dnn.readNetFromCaffe(config_path, model_path)
    descriptor_model: cv2.dnn.Net = cv2.dnn.readNetFromTorch(descriptor_path)

    def __init__(self, face_image):
        self.face_image = face_image

    def detect_face(self) -> str:
        image_array = np.asarray(bytearray(self.face_image), dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if image is None:
            raise RuntimeError("Image can't be decoded")

        (h, w) = image.shape[:2]

        blob = cv2.dnn.blobFromImage(image, scalefactor = 1.0, size = (300, 300), mean = (104.0, 177.0, 123.0))
        self.net.setInput(blob)
        detections = self.net.forward()

        if len(detections) == 0:
            print("No face detected")
            return "No Detect"
        elif len(detections) > 1:
            print("Must be 1 face in image")
            return "Multiple Face"

        i = np.argmax(detections[0, 0, :, 2])
        confidence = detections[0, 0, i, 2]

        if confidence >= 0.9:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")

            roi = image[startY:endY, startX:endX]
            faceBlob = cv2.dnn.blobFromImage(roi, 1/255, (96, 96), (0, 0, 0), swapRB = True, crop = True)

            self.descriptor_model.setInput(faceBlob)
            vector = self.descriptor_model.forward().flatten()
            vector_str = ",".join(map(str, vector.tolist()))

            if self.__check_user__(vector):
                return "Exist User"
            else:
                return vector_str

        return "Can't detect"

    def __check_user__(self, vector):
        # Get all users
        users = User.objects.all()

        # Check the user have same as face_data detect
        for user in users:
            vector_check = np.array(list(map(float, user.face_detect_data.split(","))))
            similarity = 1 - cosine(vector_check, vector)
            if similarity >= 0.6:
                return True
        return False

    def get_user_info(self) -> any:
        return None
