const group_member_role = {
    "MEMBER": 0,
    "CO_OWNER": 1,
    "OWNER": 2
}

class GroupMember {
    constructor(id, groupId, userId) {
        this._role = "";
        this._created_at = this._updated_at = new Date();
        this._is_removed = false;
        this._role = group_member_role.MEMBER;
        this._id = id;
        this._groupId = groupId;
        this._userId = userId;
    }

    get id() {
        return this._id;
    }

    get groupId() {
        return this._groupId;
    }

    get userId() {
        return this._userId;
    }

    get created_at() {
        return this._created_at;
    }

    get updated_at() {
        return this._updated_at;
    }

    get is_removed() {
        return this._is_removed;
    }

    get role() {
        return this._role;
    }
}