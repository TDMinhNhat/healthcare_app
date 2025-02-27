const Room = require("./room");

class Call {
    constructor(id, appointment, start, end, createdAt) {
        this._id = id;
        this._start = start;
        this._end = end;
        this._createdAt = createdAt;
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

    get start() {
        return this._start;
    }

    set start(value) {
        this._start = value;
    }

    get end() {
        return this._end;
    }

    set end(value) {
        this._end = value;
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }
}

module.exports = Call;