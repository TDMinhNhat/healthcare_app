const Room = require("./room");

class Call {
    constructor(id, room, start, end, createdAt) {
        this._id = id;
        this._room = room;
        this._start = start;
        this._end = end;
        this._createdAt = createdAt;
    }

    get id() {
        return this._id;
    }

    get room() {
        return this._room;
    }

    get start() {
        return this._start;
    }

    get end() {
        return this._end;
    }

    get createdAt() {
        return this._createdAt;
    }
}

module.exports = Call;