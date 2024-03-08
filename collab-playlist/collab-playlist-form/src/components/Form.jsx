
function Form(){
    const handleSubmit = async(event) => {
        event.preventDefault(); 

        var email = localStorage.getItem("profile");

        console.log(email)

        if(email === "null"){
            console.log("LOGIN")
        }
        else{    
            const formData = new FormData(event.target);
            const url = formData.get('url');
            console.log('Submitted URL:', url);
        
            event.target.elements.url.value = '';
        
            try {
                const response = await fetch('http://localhost:3000/add', {
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
    <div className='flex justify-center '>
        <form className="flex justify-center flex-col" onSubmit={handleSubmit}> 
        <label htmlFor="url">Enter Song URL</label> 
        <input type='url' placeholder='Enter Song URL' name='url' id='url' />
        <br />
        <button type='submit'>Submit</button> 
        </form>
    </div>
    );
}
    

export default Form;