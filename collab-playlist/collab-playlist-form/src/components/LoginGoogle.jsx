import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';

function LoginGoogle(){

    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);
    const [ redirect, setRedirect ] = useState([]);

    // setProfile(null)

    const navigate = useNavigate();

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
        <div className="login-container">
            <h1 className="title">Login to Add Songs</h1>
            {profile ? (
                <button className="logout-button" onClick={logOut}>Log out</button>
            ) : (
                <button className="login-button" onClick={login}>Sign in with Google 🚀</button>
            )}
        </div>
    );
}

export default LoginGoogle