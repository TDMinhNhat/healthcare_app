const axios = require("axios");

const getListSearchUser = async (inputText) => {
    return await axios({
        method: "GET",
        url: "http://localhost:9000/authenticate/api/v1/user/search",
        params: {
            input: inputText
        }
    }).then(response => response.data).catch(error => {
        console.log(error);
        return error;
    });
}

module.exports = { getListSearchUser };