const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
var generateHTML = require("./generateHTML");
const path = require("path")
var convertapi = require('convertapi')('yeCynSawpRtd0VHX');
​
function promptUser() {
    return inquirer
        .prompt([{
            message: "Enter your GitHub username",
            name: "username"
        }, {
            type: "list",
            message: "Choose a color",
            name: "favColor",
            choices: ["green", "red", "blue", "pink"]
        }])
}
​
function init() {
    return promptUser().then(function({ username, favColor }) {
        const queryUrl = `https://api.github.com/users/${username}`;
        axios
            .get(queryUrl)
            .then(function(response) {
                const res = response.data;
                response.data.color = favColor;
                const name = res.name;
                const userBio = res.bio;
                const publicRepos = res.public_repos;
                const followers = res.followers;
                const starred = res.starred_url.split(",")
                res.stars = starred.length;
                const following = res.following;
​
                console.log(res)
                console.log(name, `\n`, userBio, `\n`, publicRepos, `\n`, followers, `\n`, following)
​
                const html = generateHTML(res);
                writeToFile("resume.html", html);
            })
        convertapi.convert('pdf', { File: './resume.html' })
            .then(function(result) {
                // get converted file url
                console.log("Converted file url: " + result.file.url);
                // save to file
                return result.file.save(__dirname + "/resume.pdf");
            })
            .then(function(file) {
                console.log("File saved: " + file);
            });
    })
}
​
function writeToFile(fileName, data) {
    return fs.writeFileSync(path.join(process.cwd(), fileName), data);
}
​
init()