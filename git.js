const axios = require("axios");
require("dotenv").config();

const git = {
    userName(username){
       return axios
        .get(
            `https://api.github.com/users/${username}`
        ) 
        .catch(function (err){
            console.log("user not found");
            process.exit(1)
        }
        );
    }
}
module.exports = git;