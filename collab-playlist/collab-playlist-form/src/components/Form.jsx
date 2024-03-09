import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import WT from "../assets/wt.svg";
import VIT from "../assets/vit.svg";

// import BackgroundSVG from "./assets/bg.svg";

function Form(){

    const navigate = useNavigate();

    const logOut = () => {
        googleLogout();
        // setProfile(null);
        localStorage.setItem('profile', null);
        navigate('/', { search: '?query=null' });
    };

    const handleSubmit = async(event) => {
        event.preventDefault(); 

        var email = localStorage.getItem("profile");

        
        if(email === "null"){
            navigate('/', { search: '?query=null' });
        }
        else{    
            const formData = new FormData(event.target);
            const url = formData.get('url');
            console.log('Submitted URL:', url);
        
            event.target.elements.url.value = '';
        
            try {
                const response = await fetch('https://spotify-collab-backend.onrender.com/add', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, email }), 
            });
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Request sent successfully');
            } catch (error) {
            console.error('Error sending request:', error);
            }
        }
        
    };  
    
    return (
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh", padding:"1rem", gap:"30%"}}>
            <div className='nav'>
                <img className="l2" src={VIT} style={{maxHeight:"4rem"}}></img> 
                
                {/* <button onClick={logOut} style={{backgroundColor:"#ec350e", color:"white", borderRadius:"16px", padding:"12px"}}>Log out</button> */}
                <img className="l3  " src={WT} style={{maxHeight:"4rem"}}></img>

            </div>
            <div style={{display:"flex", alignItems:"center", height:"100%",width:"100%", justifyContent:"center"}}>
            <form className="form" onSubmit={handleSubmit} style={{display:"flex",
                                                            flexDirection:"column",
                                                            alignItems:"center",
                                                            height:"100%",
                                                            width:"100%",
                                                            gap:"1rem"
                                                            }}> 
                <label htmlFor="url" style={{color:"#ff6bb2", fontFamily:"sans-serif", fontWeight:"800", display:'flex', justifyContent:"center", textAlign:"center"}}>Enter Spotify URL of the <br></br>song you want to add</label> 
                <input type='url' placeholder='Enter Song URL' name='url' id='url' />
                <button type='submit' style={{ backgroundColor:"#ec350e", color:"white", borderRadius:"16px", padding:"1rem 2rem"}}>Submit</button> 
                </form>
            </div>
        </div>

    // <div className='flex-col justify-center ' style={{display:"flex",
    //                                                 flexDirection:"column",
    //                                                 alignItems:"center",
    //                                                 height:"100svh"
    // }}>
    //     <div>
    //         <button onClick={logOut}>Log out</button>
    //     </div>
    //     <div>
    //     <form className="" onSubmit={handleSubmit} style={{display:"flex",
    //                                                 flexDirection:"column",
    //                                                 alignItems:"center"}}> 
    //     <label htmlFor="url">Enter Song URL</label> 
    //     <input type='url' placeholder='Enter Song URL' name='url' id='url' />
    //     <br />
    //     <button type='submit'>Submit</button> 
    //     </form>
    //     </div>
    // </div>
    );
}
    

export default Form;