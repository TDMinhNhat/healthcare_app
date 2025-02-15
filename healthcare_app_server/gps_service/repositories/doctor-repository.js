const Doctor = require("../models/doctor");
const client = require("../database-config");

class DoctorRepository {

    async add(doctor) {
        let list_doctor = this.getAll();

        if (list_doctor === null || list_doctor === undefined) {
            list_doctor = [doctor]
        } else {
            list_doctor.append(doctor);
        }

        const result = await (async () => {
            await client.set("list_doctor_connect", list_doctor);
        })().then(() => true).catch(error => false)

        return result ? doctor : null;
    }

    delete(id) {
        let list_doctor = this.getAll();
        let doctor_size = list_doctor.length;

        list_doctor = list_doctor.filter(doctor => doctor.doctorId !== id);

        if(doctor_size !== list_doctor.length) {
            (async () => {
                await client.set("list_doctor_connect", list_doctor);
            })().catch(error => console.log(error))

            return true;
        }

        return false;
    }

    getById(id) {
        const get_doctor = this.getAll().filter(doctor => doctor.doctorId === id)[0];
        return get_doctor;
    }

    getAll() {
        let getListDoctor = client.get("list_doctor_connect");
        return getListDoctor;
    }
}

module.exports = DoctorRepository;