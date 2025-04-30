import threading
from confluent_kafka import Consumer, KafkaException
import json
import logging as log

topics = ["predict_salary_year", "predict_salary_month", "predict_salary_quarter"]

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
            case "predict_salary_year":
                self.__predict_salary_year__(data)
            case "predict_salary_month":
                self.__predict_salary_month__(data)
            case "predict_salary_quarter":
                self.__predict_salary_quarter__(data)
            case _:
                print("There're no matched topic")

    def __predict_salary_year__(self, data) -> None:
        pass

    def __predict_salary_month__(self, data) -> None:
        pass

    def __predict_salary_quarter__(self, data) -> None:
        pass