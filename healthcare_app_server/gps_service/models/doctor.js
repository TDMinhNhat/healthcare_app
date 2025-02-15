class Doctor {
    doctorId = "";
    latitude = 0;
    longitude = 0;

    constructor(doctorId, latitude, longitude) {
        this.doctorId = doctorId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    getDoctorId() {
        return this.doctorId;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }
}

module.exports = Doctor;