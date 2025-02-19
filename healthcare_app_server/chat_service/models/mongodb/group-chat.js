class GroupChat {
    constructor(id, senderId, groupId, message) {
        this._created_at = this._updated_at = new Date();
        this._is_recall = false;
        this._id = id;
        this._senderId = senderId;
        this._groupId = groupId;
        this._message = message;
    }

    get id() {
        return this._id;
    }

    get senderId() {
        return this._senderId;
    }

    get groupId() {
        return this._groupId;
    }

    get message() {
        return this._message;
    }

    get created_at() {
        return this._created_at;
    }

    get updated_at() {
        return this._updated_at;
    }

    get is_recall() {
        return this._is_recall;
    }
}