const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
var generateHTML = require("./generateHTML");
const path = require("path");
const open = require("open")
const convertFactory = require('electron-html-to');
const git = require("./git")

function promptUser() {
    return inquirer
        .prompt([{
            type: "input",
            message: "Enter your GitHub username",
            name: "gitusername"
        }, {
            type: "list",
            message: "Choose a color",
            name: "color",
            choices: ["green", "red", "blue", "pink"]
        }]).then(function({gitusername, color}) {
            git
                .userName(gitusername)
                .then(function (response) {
                    console.log(response)
                    return generateHTML({color, ...response.data})
                  
                })
                .then(html => {
                
                    const conversion = convertFactory({
                      converterPath: convertFactory.converters.PDF
                    });
                    // conversion({ html: '<h1>Hello World</h1>' }, function(err, result) {
                    //     if (err) {
                    //       return console.error(err);
                    //     }
                       
                    //     console.log(result.numberOfPages);
                    //     console.log(result.logs);
                    //     result.stream.pipe(fs.createWriteStream('/path/to/anywhere.pdf'));
                    //     conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
                    //   });
                    console.log(html)
            
                    conversion({ html }, function(err, result) {
                      if (err) {
                        return console.error(err);
                      }
            
                      result.stream.pipe(
                        fs.createWriteStream(path.join(__dirname, "resume.pdf"))
                      );
                      conversion.kill();
                    });
            
                    open(path.join(process.cwd(), "resume.pdf"));
                  
              });

        })
        
        
}

// function init() {
//     promptUser().then(function ({ gitusername, favColor }) {
//         git
//             .userName(gitusername)
//             .then(function (response) {
//                 generateHTML({ favColor, ...response.data })
//             });
//     })
//     console.log(response)
// }
// init()
promptUser()
