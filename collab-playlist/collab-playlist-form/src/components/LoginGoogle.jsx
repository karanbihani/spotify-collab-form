import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginGoogle() {
    const [user, setUser] = useState(null);  
    const [profile, setProfile] = useState(null);  
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    
    useEffect(() => {
        // Load profile from localStorage on site load
        const storedProfile = localStorage.getItem('profile');
        if (storedProfile) {
            setProfile(storedProfile);
        }
    }, []);


    useEffect(() => {
        if (user) {
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
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
    }, [user]);

    

    const logOut = () => {
        googleLogout();
        setProfile(null);
        localStorage.setItem('profile', JSON.stringify(null));
        navigate('/');
    };

    return (
        <div className="login-container">
            {console.log(profile)}
            {profile && profile !== "null" ? (
                <>
                <h1 className="title">LogOut</h1>
                <button className="logout-button" onClick={logOut}>Log out</button>
                </>
            ) : (
                <>
                <h1 className="title">Login to Add Songs</h1>
                <button className="login-button" onClick={login}>Sign in with Google 🚀</button>
                </>
            )}
        </div>
    );
}

export default LoginGoogle;
