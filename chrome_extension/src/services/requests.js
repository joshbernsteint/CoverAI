import axios from 'axios';
import { useAuth } from '@clerk/chrome-extension';


class Requests{
    constructor(){
        const { getToken } = useAuth();
        this.getToken = getToken;
        this.token = undefined;
    }
    async get(endPoint, otherHeaders={}){
        if(!this.token){
            this.token = await this.getToken();
        }
        return (await axios.get(endPoint, {headers: {...otherHeaders, "Authorization": `Bearer ${this.token}`}}));
    }

    async post(endPoint, body, otherHeaders={}){
        if(!this.token){
            this.token = await this.getToken();
        }
        return (await axios.post(endPoint, body, {headers: {...otherHeaders, "Authorization": `Bearer ${this.token}`}}));
    }

    async getAuthHeader(){
        if(!this.token) this.token = await this.getToken();
        return {"Authorization": `Bearer ${this.token}`};
    }
}

export default Requests;