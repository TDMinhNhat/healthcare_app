class Doctor {
    private readonly doctorId: string;
    private readonly latitude: number;
    private readonly longitude: number;

    constructor(doctorId: string, latitude: number, longitude: number) {
        this.doctorId = doctorId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    getDoctorId(): string {
        return this.doctorId;
    }

    getLatitude(): number {
        return this.latitude;
    }

    getLongitude(): number {
        return this.longitude;
    }
}

module.exports = Doctor;