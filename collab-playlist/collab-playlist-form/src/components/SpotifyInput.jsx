import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';  
import Navbar from './Navbar';

function SpotifyInput() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [accessToken, setAccessToken] = useState('');
    const [actionMessage, setActionMessage] = useState(''); 

    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

    const navigate = useNavigate();  // Initialize navigate function

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

    const debouncedSearch = debounce(searchSpotify, 500);

    const handleTrackClick = async (url) => {
        const email = localStorage.getItem("profile");
        if(email === "null"){
          navigate('/');
          return;
        }

        setActionMessage('Adding song...'); // Initial message for user feedback
        try {
            const response = await fetch('https://spotify-collab-backend.onrender.com/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, email }),
            });

        // Handle different response statuses
        if (response.status === 200) {
            setActionMessage('Song added successfully!');
        } else if (response.status === 409) {
            setActionMessage('This song already exists in the playlist.');
        } else if (response.status === 429) {
            setActionMessage('Rate limit exceeded. Please wait 4 hours before adding more songs.');
        } else {
            throw new Error('Failed to add the song.');
        }
        } catch (error) {
        setActionMessage(error.message);
        }

    // Clear the message after some time
    setTimeout(() => setActionMessage(''), 5000);
  };

    return (
        <div className='searchPage'>
            <Navbar />
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                placeholder="What do you want to add to playlist?"
            />

            {actionMessage && (
                <div className="add-status">
                    {actionMessage}
                </div>
            )}

            {searchTerm.length > 0 ? (
                <ul>
                    {searchResults.map((track) => {
                        const image = track.album.images.reduce(
                            (smallest, image) => {
                                if (image.height < smallest.height) return image;
                                return smallest;
                            },
                            track.album.images[0]
                        );

                        return (
                            <li key={track.id} className="search-item">
                                <img
                                    src={image.url}
                                    alt={track.name}
                                    className="search-item-img"
                                />
                                <button
                                    onClick={() => handleTrackClick(track.external_urls.spotify)}
                                    className="search-item-button"
                                >
                                    <p className="track-name">{track.name}</p>
                                    <p className="artist-name">{track.artists.map((artist) => artist.name).join(', ')}</p>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                // Message to user when search term is empty
                <div className="search-instructions">
                    <p>Enter the name of a song into the search bar above and select a result to add it the playlist.</p>
                </div>
            )}
        </div>
    );
}

export default SpotifyInput;
