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

const getUserInfo = async (userId) => {
    const result = await axios({
        method: "GET",
        url: `http://localhost:9000/authenticate/api/v1/user/user_id/${userId.split("#")[1]}`,
    }).then(response => response.data.data).catch(error => {
        console.log(error);
        return error;
    });
    return result;
}

module.exports = { getListSearchUser, getUserInfo };