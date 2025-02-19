class PrivateChat {
    constructor(id, senderId, receiverId, message) {
        this._is_recall = this._is_read = false;
        this._created_at = this._updated_at = new Date();
        this._id = id;
        this._senderId = senderId;
        this._receiverId = receiverId;
        this._message = message;
    }

    get id() {
        return this._id;
    }

    get senderId() {
        return this._senderId;
    }

    get receiverId() {
        return this._receiverId;
    }

    get message() {
        return this._message;
    }

    get is_recall() {
        return this._is_recall;
    }

    get is_read() {
        return this._is_read;
    }

    get created_at() {
        return this._created_at;
    }

    get updated_at() {
        return this._updated_at;
    }
}