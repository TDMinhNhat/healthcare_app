import threading
from confluent_kafka import Consumer, KafkaException
from healthcare_app_server.models import *
import json
import logging as log

topics = ["insert_user", "insert_type_detect"]

class KafkaConsumer(threading.Thread):

    def __init__(self):
        self.consumer = Consumer(
            {
                'bootstrap.servers': 'localhost:9092',
                'group.id': 'image_detect_consumer',
                'auto.offset.reset': 'earliest',
                'enable.auto.commit': True
            }
        )
        threading.Thread.__init__(self, daemon = True)

    def run(self):
        self.consumer.subscribe(topics)

        while True:
            try:
                message = self.consumer.poll(1.0)
                if(message is None):
                    continue
                elif message.error():
                    log.error(f"Consumer error: {message.error()}")
                    continue

                topic = message.topic()
                data = message.value().decode("utf-8")

                self.__filter_topic__(topic, data)

            except KafkaException as e:
                log.error(f"KafkaException: {e}")
                continue
            except Exception as e:
                log.error(f"Exception: {e}")
                continue

        self.consumer.close()

    def __filter_topic__(self, topic, data) -> None:
        match topic:
            case "insert_user":
                self.__insert_user__(data)
            case "insert_type_detect":
                self.__insert_type_detect__(data)
            case _:
                print("There're no matched topic")

    def __insert_user__(self, data) -> None:
        try:
            data_json = json.loads(data)

            user = User(
                user_id = data_json['userId'],
                face_detect_data = data_json['faceImageEncode']
            )

            user.save()
        except Exception as e:
            print(f"Exception: {e}")

    def __insert_type_detect__(self, data) -> None:
        try:
            data_json = json.loads(data)

            type_detect = TypeDetect(
                type_name = data_json["typeName"]
            )

            type_detect.save()

        except Exception as e:
            print(f"Exception: {e}")
