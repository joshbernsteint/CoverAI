import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignIn, useAuth } from '@clerk/chrome-extension';
import { Button } from 'react-bootstrap';



function PastLetters({requester, env, ...props}){
    const { isSignedIn } = useAuth();
    async function downloadById(id){
        const URL = `${requester.baseUrl}/covers/makeFileFromId/${id}`;
        await chrome.downloads.download({method: "GET", url:URL, saveAs: true, headers: [{name: "Authorization", value: `Bearer ${await requester.getToken()}`}]});
    }


    function Letter({id, date, employer}){
        const [isFocused, setFocus] = useState(false);
        const editorLink = `${import.meta.env.VITE_WEBSITE_URL || "http://localhost:5173/"}/text-editor/${id}`
        return (
            <div className='past_cl' onMouseLeave={() => setFocus(false)} onClick={() => setFocus(true)}>
                {
                    isFocused ? (
                    <>
                        <a style={{width: "70%", height: "100%",color: "rgba(255, 255, 255, 0.87)", padding: ".6em 4em"}} href={editorLink} target='_blank' className='like-button'>Edit</a>
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
            const {data} = await requester.get("/covers/getAllCoverLetters");
            setList(data.reverse());
        }
        if(isSignedIn && requester) getPastLetters();
    }, [isSignedIn, requester]);


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