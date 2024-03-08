import generateRandomString from "../utils/generateRandomString";

function Login(){
    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';

    // console.log(CLIENT_ID,"\n",REDIRECT_URI)

    const handleLogin = () => {
        window.location = `https://accounts.spotify.com/authorize?${new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID, 
        scope,
        redirect_uri: REDIRECT_URI, // 
        state
        })}`;
    };

    return (
        <div>
        <h1>Spotify Login</h1>
        <h2>{state}</h2>
        <h2>{CLIENT_ID}</h2>
        <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    );
}

export default Login;
