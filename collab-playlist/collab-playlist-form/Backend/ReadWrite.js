const fs = require('fs');

function Read(){
    console.log("Hi");  
}

function Write(url){
    fs.appendFile('Backend/Files/songList.txt', `${url}`+"\n", function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
}

module.exports = {Read, Write, fs}
