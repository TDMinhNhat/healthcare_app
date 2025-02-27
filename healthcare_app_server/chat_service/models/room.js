class Room {
    constructor(id, appointment, roomId, createdAt) {
        this._id = id;
        this._appointment = appointment;
        this._roomId = roomId;
        this._createdAt = createdAt;
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

    get roomId() {
        return this._roomId;
    }

    set roomId(value) {
        this._roomId = value;
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }
}

module.exports = Room;