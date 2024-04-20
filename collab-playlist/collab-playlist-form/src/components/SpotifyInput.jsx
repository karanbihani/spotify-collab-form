import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';

function SpotifyInput() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [accessToken, setAccessToken] = useState('');

    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

    useEffect(() => {
        const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
        const credentialsBase64 = btoa(credentials);
        const fetchAccessToken = async () => {
            try {
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${credentialsBase64}`,
                    },
                    body: 'grant_type=client_credentials',
                });
                const data = await response.json();
                setAccessToken(data.access_token);
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        };

        fetchAccessToken();

        const interval = setInterval(fetchAccessToken, 3600000); // Refresh token every 3600 seconds (1 hour)
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (searchTerm.length > 0) {
            debouncedSearch();
        } else {
            setSearchResults([]); // Clears results when input is cleared
        }
    }, [searchTerm, accessToken]);

    const searchSpotify = async () => {
        if (!accessToken || searchTerm.trim() === '') return; // Do not search if no access token or if search term is empty
        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setSearchResults(data.tracks.items);
        } catch (error) {
            console.error('Error searching for songs:', error);
        }
    };

    // Debounce the searchSpotify function so it triggers 0.5s after the user stops typing
    const debouncedSearch = debounce(searchSpotify, 500);

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <ul>
                {searchResults.map((track) => (
                    <li key={track.id}>
                        <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                            {track.name} - {track.artists.map((artist) => artist.name).join(', ')}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SpotifyInput;
