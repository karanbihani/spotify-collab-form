const ReadWrite = require("./ReadWrite");
const express = require("express");
const app = express();
const port = 3000;

const dotenv = require("dotenv");
const querystring = require('querystring');
const request = require('request'); 


const CLIENT_ID  = process.env.CLIENT_ID;
const CLIENT_SECRET  = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/callback';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.get("/" , (req, res)=>{
  res.send("Hi")
})

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public playlist-read-private playlist-read-collaborative';

  console.log("login")

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  
  console.log(code)

  
});
  
app.post("/add", (req, res)=>{
    console.log(req.body)
    var {url} = req.body;
    res.send("WORKED");
    ReadWrite.Write(`${url}`);
})

app.listen(port, ()=>{
    console.log(`Example app listening on port: ${port}`)
})
