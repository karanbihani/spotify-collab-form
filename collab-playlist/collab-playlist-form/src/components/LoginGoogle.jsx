import { GoogleLogin } from '@react-oauth/google';
import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import WT from "../assets/wt.svg";
import VIT from "../assets/vit.svg";

// import BackgroundSVG from "./assets/bg.svg";

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

        <div style={{width:"100%", height:"100svh", color:"white", padding:"2rem", display:"flex", flexDirection:"column", alignItems:"center", gap:"4rem"}}>
            <div className='nav'>
                <img className="l2" src={VIT} style={{maxHeight:"4rem"}}></img> 
                
                {/* <button onClick={logOut} style={{backgroundColor:"#ec350e", color:"white", borderRadius:"16px", padding:"12px"}}>Log out</button> */}
                <img className="l3  " src={WT} style={{maxHeight:"4rem"}}></img>

            </div>
            <h1 style={{fontSize:"2.25rem", fontFamily:"sans-serif", textAlign:"center"}}>Login in To Add Songs</h1>
            {profile===null ? (
                <div>
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={login} style={{ backgroundColor:"#ec350e", color:"white", borderRadius:"16px", padding:"1rem 2rem", }}>Sign in with Google 🚀 </button>
            )}
        </div>
    );
}

export default LoginGoogle