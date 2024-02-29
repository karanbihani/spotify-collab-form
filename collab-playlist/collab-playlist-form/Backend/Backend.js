const ReadWrite = require("./ReadWrite");
const express = require("express");
const app = express();
const port = 3000;

const dotenv = require("dotenv");
dotenv.config({ path: 'Backend/.env' });

const querystring = require('querystring');
const request = require('request'); 

const CLIENT_ID  = process.env.CLIENT_ID;
const CLIENT_SECRET  = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/callback';

console.log(CLIENT_ID,CLIENT_SECRET)

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
      client_id: `${CLIENT_ID}`,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  
  if (state === null) {
    res.redirect('/#' +
        querystring.stringify({
            error: 'state_mismatch'
        }));
} else {
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            var refresh_token = body.refresh_token;
            // Redirect or send response as needed
            res.send('Authentication successful! Access token: ' + access_token);
        } else {
            // Handle error
            res.status(response.statusCode).send('Error: ' + error);
        }
    });
}
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
