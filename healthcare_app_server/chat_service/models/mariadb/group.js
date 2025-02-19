const group_status = {
    "ACTIVE": 0,
    "BLOCKED": 1,
    "DELETED": 2
}

class Group {
    constructor(id, groupId, groupName) {
        this._groupId = groupId;
        this._groupName = groupName;
        this._group_description = null;
        this._allow_join = this._allow_invite = this._allow_notification = this._allow_chat = true;
        this._wait_for_response = false;
        this._created_at = this._updated_at = new Date();
        this._status = 0;
        this._id = id;
        this._groupId = groupId;
        this._groupName = groupName;
        this._status = group_status.ACTIVE;
    }

    get id() {
        return this._id;
    }

    get groupId() {
        return this._groupId;
    }

    get groupName() {
        return this._groupName;
    }

    get group_description() {
        return this._group_description;
    }

    get allow_join() {
        return this._allow_join;
    }

    get allow_invite() {
        return this._allow_invite;
    }

    get allow_notification() {
        return this._allow_notification;
    }

    get allow_chat() {
        return this._allow_chat;
    }

    get wait_for_response() {
        return this._wait_for_response;
    }

    get created_at() {
        return this._created_at;
    }

    get updated_at() {
        return this._updated_at;
    }

    get status() {
        return this._status;
    }
}