import { IRepository } from "../repository";
import Doctor from "../../models/doctor";
import client = require("../../database-config");

class DoctorRepository implements IRepository<Doctor, String> {

    add(doctor: Doctor): Doctor {
        let list_doctor = this.getAll();

        if(list_doctor === null || list_doctor === undefined) {
            list_doctor = [doctor]
        } else {
            list_doctor.append(doctor);
        }

        (async () => {
            await client.set("list_doctor_connect", list_doctor);
        })().catch(error => console.log(error))

        return null;
    }

    delete(id: string): boolean {
        let list_doctor = this.getAll();
        let doctor_size: number = list_doctor.length;

        list_doctor = list_doctor.filter(doctor => doctor.doctorId !== id);

        if(doctor_size !== list_doctor.length) {
            (async () => {
                await client.set("list_doctor_connect", list_doctor);
            })().catch(error => console.log(error))

            return true;
        }

        return false;
    }

    getById(id: string): Doctor {
        const get_doctor = this.getAll().filter(doctor => doctor.doctorId === id)[0];
        return get_doctor;
    }

    getAll(): Doctor[] {
        let getListDoctor: Doctor[] = client.get("list_doctor_connect");
        return getListDoctor;
    }
}