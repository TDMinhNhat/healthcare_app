const friend_status = {
    PENDING: 0,
    ACCEPTED: 1,
    REJECTED: 2
}

class Friend {
    constructor(sender, receiver) {
        this._created_at = this._updated_at = new Date();
        this._sender = sender;
        this._receiver = receiver;
        this._status = friend_status.PENDING;
    }

    get sender() {
        return this._sender;
    }

    get receiver() {
        return this._receiver;
    }

    get status() {
        return this._status;
    }

    get created_at() {
        return this._created_at;
    }

    get updated_at() {
        return this._updated_at;
    }
}