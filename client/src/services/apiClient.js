import axios from "axios";

class ApiClient {
  constructor(remoteHostUrl) {
    this.remoteHostUrl = remoteHostUrl;
  }

  async request({ endpoint, method = `GET`, data = {} }) {
    const url = `${this.remoteHostUrl}/${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const res = await axios({ url, method, data, headers });
      return { data: res.data, error: null };
    } catch (error) {
      console.error("APIclient.makeRequest.error:");
      console.error({ errorResponse: error.response });
      const message = error?.response?.data?.error?.message;
      return { data: null, error: message || String(error) };
    }
  }

  async getUserFromSession() {
    return await this.request({ endpoint: `users/me`, method: `GET` });
  }

  async signUpUser(credentials) {
    return await this.request({
      endpoint: "users/signup",
      method: "POST",
      data: credentials,
    });
  }
}

const API = new ApiClient(import.meta.env.VITE_API_URL);
export default API;
