class Response:
    def __init__(self):
        self.code = 200,
        self.message = "Success",
        self.data = None

    def __init__(self, code: int, message: str, data: object):
        self.code = code
        self.message = message
        self.data = data

    def get_code(self) -> int:
        return self.code

    def get_message(self) -> str:
        return self.message

    def get_data(self) -> object:
        return self.data