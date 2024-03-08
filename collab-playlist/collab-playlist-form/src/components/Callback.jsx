import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Callback() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState(null);
    const [userName, setName] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
            const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
            const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

            const code = new URLSearchParams(location.search).get('code');
            const state = new URLSearchParams(location.search).get('state');

            if (state === null) {
                navigate('/', { state: { error: 'state_mismatch' } });
            } else {
                const authOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
                    },
                    body: new URLSearchParams({
                        code: code,
                        redirect_uri: REDIRECT_URI,
                        grant_type: 'authorization_code'
                    })
                };

                try {
                    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
                    const data = await response.json();

                    // If access token is obtained successfully, fetch user's profile data
                    if (data.access_token) {
                        const accessToken = data.access_token;
                        const userProfileResponse = await fetch('https://api.spotify.com/v1/me', {
                            headers: {
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const userProfileData = await userProfileResponse.json();
                        const userEmail = userProfileData.email;
                        const userName = userProfileData.display_name;
                        setEmail(userEmail);
                        setName(userName);
                    }

                    // Handle response data as needed
                    console.log(data);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        fetchToken();
    }, [navigate, location.search]);

    const handleClick = () => {
        navigate('/add', { search: '?query=react&page=1' });
    };

    return (
        <div>
            <h1>Callback Page</h1>
            <h3>{email}</h3>
            <h3>{userName}</h3>
            <button onClick={handleClick}>Add Songs</button>
        </div>
    );
}

export default Callback;
