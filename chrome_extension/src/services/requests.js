import axios from 'axios';


class Requester{
    constructor(baseUrl="", token, getToken){
        this.getToken = getToken;
        this.baseUrl = baseUrl;
        this.token = token
    }
    async get(endPoint, otherHeaders={}){
        return (await axios.get(this.baseUrl + endPoint, {headers: {...otherHeaders, "Authorization": `Bearer ${this.token}`}}));
    }

    async post(endPoint, body, otherHeaders={}){
        return (await axios.post(this.baseUrl + endPoint, body, {headers: {...otherHeaders, "Authorization": `Bearer ${this.token}`}}));
    }

    async delete(endPoint, otherHeaders={}){
        return (await axios.delete(this.baseUrl + endPoint,{headers: {...otherHeaders, "Authorization": `Bearer ${this.token}`}}));
    }
    async downloadById(id){
        const URL = `${this.baseUrl}/covers/makeFileFromId/${id}`;
        await chrome.downloads.download({method: "GET", url:URL, saveAs: true, headers: [{name: "Authorization", value: `Bearer ${await this.token}`}]});
    }
}

export default Requester;