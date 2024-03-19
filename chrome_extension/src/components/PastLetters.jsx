import axios from 'axios';
import { useEffect, useState } from 'react';



function PastLetters(props){

    async function downloadById(id){
        await chrome.downloads.download({method: "GET", url: `http://localhost:3000/covers/makeFileFromId/${id}`, saveAs: true});
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
            const {data} = await axios.get("http://localhost:3000/covers/getAllCoverLetters");
            setList(data.reverse());
        }
        getPastLetters();
    }, []);

    console.log(list);

    return (
        <div style={{maxWidth: "450px"}}>
            <h2>Your Past Cover Letters:</h2>
            {
                list.map((e,i) => (
                    <Letter key={i} date={e.date} employer={e.employer_name} id={e._id}/>
                ))
            }
        </div>
    );
}

export default PastLetters;