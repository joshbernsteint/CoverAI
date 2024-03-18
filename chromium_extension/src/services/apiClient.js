import axios from "axios";

class ApiClient {
  constructor(remoteHostUrl) {
    this.remoteHostUrl = remoteHostUrl;
    this.authToken = null; // Add a field to store the auth token
  }

  setAuthToken(token) {
    this.authToken = token; // Method to update the auth token
  }

  async request({ endpoint, method = `GET`, data = {} }) {
    const url = `${this.remoteHostUrl}/${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
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

  async signUpUser(credentials) {
    return await this.request({
      endpoint: "users/signup",
      method: "POST",
      data: credentials,
    });
  }
}

const API = new ApiClient("http://localhost:3000");
export default API;
