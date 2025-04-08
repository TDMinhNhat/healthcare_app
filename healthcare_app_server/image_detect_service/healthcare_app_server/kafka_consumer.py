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
            case "insert_patient":
                self.__insert_user__(data)
            case _:
                print("There're no matched topic")

    def __insert_user__(self, data) -> None:
        try:
            data_json = json.loads(data)

            user = User(
                user_id = data_json['userId'],
                face_encode_value = data_json['faceEncodeValue']
            )

            user.save()
        except Exception as e:
            print(f"Exception: {e}")