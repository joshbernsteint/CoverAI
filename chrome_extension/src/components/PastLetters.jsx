import axios from 'axios';
import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignIn, ClerkProvider, SignOutButton } from '@clerk/chrome-extension';
import Requests from '../services/requests';
import { Button } from 'react-bootstrap';



function PastLetters({loginStatus, ...props}){
    const myRequester = new Requests()

    async function downloadById(id){
        await chrome.downloads.download({method: "GET", url: `http://localhost:3000/covers/makeFileFromId/${id}`, saveAs: true, headers: [{name: "Authorization", value: await myRequester.getToken()}]});
    }


    function Letter({id, date, employer}){
        const [isFocused, setFocus] = useState(false);
        return (
            <div className='past_cl' onMouseLeave={() => setFocus(false)} onClick={() => setFocus(true)}>
                {
                    isFocused ? (
                    <>
                        <a style={{width: "70%", height: "100%",color: "rgba(255, 255, 255, 0.87)", padding: ".6em 4em"}} href={import.meta.env.VITE_WEBSITE_URL} target='_blank' className='like-button'>Edit</a>
                        <Button style={{width: "50%"}} onClick={() => downloadById(id)}>Download</Button>
                    </>
                    
                    ) : (
                        <>
                            <span>{employer}</span><br/>
                            <span>{date}</span>
                        </>
                    )
                }
            </div>
        );
    }
    const [list, setList] = useState([]);

    useEffect(() => {
        async function getPastLetters(){
            const {data} = await myRequester.get("http://localhost:3000/covers/getAllCoverLetters");
            setList(data.reverse());
        }
        getPastLetters();
    }, []);

    console.log(list);

    return (
        <div>
        <SignedIn>
        <div>
        <div style={{maxWidth: "450px"}}>
            <h2>Your Past Cover Letters:</h2>
            {
                list.length === 0 ? (<p>Huh, nothing here...</p>) : ( 
                    list.map((e,i) => (
                        <Letter key={i} date={e.date} employer={e.company_name} id={e._id}/>
                    ))
                )
            }
        </div>
        </div>
      </SignedIn>
      <SignedOut>
        <SignIn
          afterSignInUrl='/'
          signUpUrl='/signup'
        />
      </SignedOut>
        </div>

    );
}

export default PastLetters;