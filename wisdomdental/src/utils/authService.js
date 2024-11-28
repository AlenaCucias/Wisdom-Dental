import axios from "axios";

const API_URL = 'http://127.0.0.1:5000/api';

export const authenticateUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/authenticate_user`, { email, password }); 
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error response:", error.response.data);
            console.error("Error status:", error.response.status);
            console.error("Error headers:", error.response.headers);
            throw new Error(`Server responded with status ${error.response.status}: ${error.response.data.error || 'Unknown error'}`);
        } else if (error.request) {
            console.error("Error request:", error.request);
            throw new Error("No response from server. Please check your connection.");
        } else {
            console.error("Error message:", error.message);
            throw error;
        }        
    }
};