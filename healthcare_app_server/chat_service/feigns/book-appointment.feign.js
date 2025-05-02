const axios = require("axios");

const PREFIX = "http://localhost:11000/appointment/api/v1/booking/status"
const updateBookAppointmentStatus = async (bookAppointmentId, status) => {
    await axios({
        method: "put",
        url: PREFIX,
        params: {
            bookAppointmentId: bookAppointmentId,
            status: status
        }
    });
}

module.exports = { updateBookAppointmentStatus }