import threading
import json
import pandas as pd
import logging as log
from statsmodels.tsa.stattools import adfuller, acf, pacf
from confluent_kafka import Consumer, Producer, KafkaException
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.holtwinters import SimpleExpSmoothing, Holt

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

        self.producer = Producer(
            {
                'bootstrap.servers': 'localhost:9092'
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
            case _:
                print("There're no matched topic")

    def __predict_salary_year__(self, data) -> None:
        try:
            data_json = json.loads(data)
            data = pd.DataFrame(list(data_json.items()), columns = ["Year", "Salary"])
            if data.size >= 10:
                print("ARIMA Model is used")
                series = data["Salary"]
                d = self.__get_diff_order__(series)
                p, q = self.__estimate_p_q__(series)

                model = ARIMA(series, order=(p, d, q))
                model_fit = model.fit()
                forecast = model_fit.forecast(steps = 3)
                print(forecast)
                self.producer.produce('predict_salary_year_result', json.dumps(forecast.tolist()).encode('utf-8'))
            else:
                print("Simple Exponential Smoothing is used")
                model = Holt(data["Salary"])
                model_fit = model.fit(smoothing_level=0.5, smoothing_trend=0.5, optimized=False)
                forecast = model_fit.forecast(steps = 3)
                print(forecast)
                self.producer.produce('predict_salary_year_result', json.dumps(forecast.tolist()).encode('utf-8'))
        except Exception as e:
            error_message = f"Error: {str(e)}"
            print(error_message)
            self.producer.produce('predict_salary_year_result', error_message.encode('utf-8'))
        pass

    def __get_diff_order__(self, series):
        for d in range(20):
            test_series = series.diff(d).dropna() if d > 0 else series
            p_value = adfuller(test_series)[1]
            if p_value < 0.05:
                return d
        return 20  # fallback

    def __estimate_p_q__(self, series):
        acf_vals = acf(series, nlags=50)
        pacf_vals = pacf(series, nlags=50)

        def find_cutoff(corr, threshold=0.2):
            for i in range(1, len(corr)):
                if abs(corr[i]) < threshold:
                    return i - 1  # Previous lag was the last significant
            return 0

        estimated_p = find_cutoff(pacf_vals)
        estimated_q = find_cutoff(acf_vals)
        return estimated_p, estimated_q