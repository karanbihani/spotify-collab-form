import { GoogleLogin } from '@react-oauth/google';
import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';


function LoginGoogle(){

    // const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    // const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

    // function handleCallbackResponse(response){
    //     console.log("Encoded JWT ID Token:" + response.credential);
    // }

    // useEffect(()=>{
    //     /* Global Google */ // This prevents linter from sayign google doesnnt exist

    //     google.accounts.id.initalize({
    //         client_id: CLIENT_ID,
    //         callback:   handleCallbackResponse
    //     })

    //     google.accounts.id.renderButton(
    //         document.querySelector("#signInDiv"),
    //         {theme:"outline", size:"large"}
    //     )
    // },[])

    // return(<div className="google-login">
    //     <div id="signInDiv"></div>
    // </div>)

    // const responseMessage = (response) => {
    //     console.log(response);
    // };
    // const errorMessage = (error) => {
    //     console.log(error);
    // };
    // return (
    //     <div>
    //         <h2>React Google Login</h2>
    //         <br />
    //         <br />
    //         <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    //     </div>
    // )

    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);
    const [ redirect, setRedirect ] = useState([]);

    const navigate = useNavigate();
    
    // const [data, setData] = useState([]);

    // useEffect(() => {
    // );

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                        var email = res.data.email;
                        localStorage.setItem('profile', `${email}`);
                        navigate('/add', { search: '?query=signedin' });
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
        localStorage.setItem('profile', JSON.stringify(null));
    };

    return (
        <div>
            <h2>React Google Login</h2>
            <br />
            <br />
            {profile ? (
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={login}>Sign in with Google 🚀 </button>
            )}
        </div>
    );
}

export default LoginGoogle