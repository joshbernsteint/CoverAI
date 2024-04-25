import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignIn, useAuth } from '@clerk/chrome-extension';
import axios from 'axios';

const LETTER_BUTTON_STYLE = 'like-button bg-white text-black w-[33%] hover:text-blue-500 dark:bg-[#1a1a1a] dark:text-white dark:hover:text-blue-500';

function PastLetters({requester, env, ...props}){
    const [list, setList] = useState([]);
    const { isSignedIn } = useAuth();


    async function downloadById(id){
        const URL = `${requester.baseUrl}/covers/makeFileFromId/${id}`;
        await chrome.downloads.download({method: "GET", url:URL, saveAs: true, headers: [{name: "Authorization", value: `Bearer ${await requester.getToken()}`}]});
    }

    async function deleteById(id){
        const {data} = await requester.delete(`/covers/${id}`);
        setList(l => l.filter(e => e._id !== id));
    }


    function Letter({id, date, employer}){
        const [isFocused, setFocus] = useState(false);
        const [prepDelete, setPrepDelete] = useState(false);
        const editorLink = `${import.meta.env.VITE_WEBSITE_URL || "http://localhost:5173/"}/text-editor/${id}`

        // #1a1a1a

        return (
            <div className='past_cl text-black dark:text-white' onMouseLeave={() => setFocus(false)} onClick={() => setFocus(true)}>
                {
                    prepDelete ? (
                    <>
                        <button onClick={() => deleteById(id)} className='like-button bg-white text-black dark:text-white w-[50%] hover:text-red-500 dark:bg-[#1a1a1a] dark:hover:text-red-500'>Confirm</button>
                        <button onClick={() => setPrepDelete(false)} className='like-button w-[50%] bg-white text-black hover:text-blue-500 dark:text-white dark:bg-[#1a1a1a] dark:hover:text-blue-500'>Cancel</button>
                    </>
                    ) : (
                        isFocused ? (
                        <>
                            <button className={LETTER_BUTTON_STYLE} onClick={() => window.open(editorLink)}>Edit</button>
                            <button className={LETTER_BUTTON_STYLE} onClick={() => downloadById(id)}>Download</button>
                            <button className={LETTER_BUTTON_STYLE} onClick={() => setPrepDelete(true)}>Delete</button>
                        </>
                        
                        ) : (
                            <>
                                <span>{employer}</span><br/>
                                <span>{date}</span>
                            </>
                        )
                    )
                }
            </div>
        );
    }

    useEffect(() => {
        async function getPastLetters(){
            const {data} = await requester.get("/covers/all");
            setList(data.reverse());
        }
        if(isSignedIn && requester) getPastLetters();
    }, [isSignedIn, requester]);


    return (
        <div style={{maxWidth: "450px"}} className='text-black dark: text-white'>
            <h1 className='text-3xl text-center text-black dark:text-white'>Your Letters:</h1>
            <div className='h-[150px] w-[100%] overflow-y-scroll m-4'>
            {
                list.length === 0 ? (<p>Huh, nothing here...</p>) : ( 
                    list.map((e,i) => (
                        <Letter key={i} date={e.date} employer={e.company_name} id={e._id}/>
                    ))
                )
            }
            </div>
        </div>
    );
}

export default PastLetters;