const Room = require("./room");

class Call {
    constructor(id, bookAppointment, start, end, createdAt) {
        this._id = id;
        this._start = start;
        this._end = end;
        this._createdAt = createdAt;
        this._bookAppointment = bookAppointment;
    }


    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get bookAppointment() {
        return this._bookAppointment;
    }

    set bookAppointment(value) {
        this._bookAppointment = value;
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