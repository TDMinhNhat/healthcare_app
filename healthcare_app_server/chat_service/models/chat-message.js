class ChatMessage {
    constructor(id, roomCall, reply, isRecall, createdAt, updatedAt) {
        this._id = id;
        this._roomCall = roomCall;
        this._reply = reply;
        this._isRecall = isRecall;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._appointment = appointment;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get roomCall() {
        return this._roomCall;
    }

    set roomCall(value) {
        this._roomCall = value;
    }

    get reply() {
        return this._reply;
    }

    set reply(value) {
        this._reply = value;
    }

    get isRecall() {
        return this._isRecall;
    }

    set isRecall(value) {
        this._isRecall = value;
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}

module.exports = ChatMessage