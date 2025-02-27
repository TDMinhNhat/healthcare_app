const Room = require("./room");

class ChatMessage {
    constructor(id, appointment, room, reply, isRecall, createdAt, updatedAt) {
        this._id = id;
        this._room = room;
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

    get appointment() {
        return this._appointment;
    }

    set appointment(value) {
        this._appointment = value;
    }

    get room() {
        return this._room;
    }

    set room(value) {
        this._room = value;
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