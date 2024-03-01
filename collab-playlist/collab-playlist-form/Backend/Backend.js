const ReadWrite = require("./ReadWrite");
const express = require("express");
const app = express();
const port = 3000;

const dotenv = require("dotenv");
dotenv.config({ path: 'Backend/.env' });

const querystring = require('querystring');
const request = require('request'); 

const fetch = require('node-fetch');

const CLIENT_ID  = process.env.CLIENT_ID;
const CLIENT_SECRET  = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/callback';

console.log(CLIENT_ID,CLIENT_SECRET)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var access_token;
var refresh_token;
var expires_in;

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

const getRefreshToken =  () => {
  var refreshTokenRequest = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    json: true
  };
  return(refreshTokenRequest)
}

const accessTokenRefresher = ()=>{
  a = setInterval(()=>{
    expires_in -= 1;
    console.log(expires_in);

    if (expires_in<=0){
      console.log("Timer Reached 0");

      console.log("Sending post request");
      request.post(getRefreshToken(), function(error, response, body) {
        if (!error && response.statusCode === 200) {
          access_token = body.access_token
          expires_in = body.expires_in
          if(body.refresh_token){
            refresh_token = body.refresh_token;
          }
          console.log(access_token, refresh_token);
        }
      });
    }

  }, 1000)
}

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
            access_token = body.access_token;
            refresh_token = body.refresh_token;
            expires_in = body.expires_in;
            
            res.send('Authentication successful! Access token: ' + access_token +"<br>"+ expires_in +"<br>"+refresh_token);
            accessTokenRefresher();
        } else {
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

// Adding songs to playlist



//Testing

async function getProfile(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  const data = await response.json();
  return data;
}

app.get('/profile', async (req, res) => {
  console.log(access_token, expires_in,refresh_token)
  try {
    const profileData = await getProfile(access_token);
    res.json(profileData);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

app.listen(port, ()=>{
    console.log(`Example app listening on port: ${port}`)
})
