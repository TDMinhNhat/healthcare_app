const Doctor = require("../models/doctor");
const client = require("../database.config");

class DoctorRepository {

    async add(doctor) {
        try {
            let getListDoctor = await this.getAll().then(value => value === null || value === undefined ? [] : value).catch(() => []);
            getListDoctor.push(doctor);
            await client.set("list_doctor_connect", JSON.stringify(getListDoctor));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async delete(doctor) {
        let list_doctor = await this.getAll();

        if(list_doctor.length === 0) {
            return;
        }

        list_doctor = list_doctor.filter(target => target.doctorId !== doctor.userId && target.latitude !== doctor.latitude && target.longitude !== doctor.longitude);
        await client.set("list_doctor_connect", JSON.stringify(list_doctor));
    }

    async getAll() {
        const getListDoctor = await client.get("list_doctor_connect")
            .then(value => value).catch(() => "[]");
        return JSON.parse(getListDoctor);
    }
}

module.exports = DoctorRepository;