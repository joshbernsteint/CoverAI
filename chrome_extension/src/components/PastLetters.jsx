import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, ClerkProvider, SignOutButton } from '@clerk/chrome-extension';
import Requests from '../services/requests';



function PastLetters({loginStatus, ...props}){
    const navigate = useNavigate();
    const myRequester = new Requests();

    async function downloadById(id){
        await chrome.downloads.download({method: "GET", url: `http://localhost:3000/covers/makeFileFromId/${id}`, saveAs: true, headers: [{name: "Authorization", value: await myRequester.getToken()}]});
    }


    function Letter({id, date, employer}){
        return (
            <div className='past_cl' onClick={() => downloadById(id)}>
                <span>{employer}</span><br/>
                <span>{date}</span>
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