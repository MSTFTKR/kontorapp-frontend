import axios from "axios";

export const login = async (tcVkn,password) => {
  return await axios.post(
    `http://localhost:3001/auth/login`, {
        tcVkn: tcVkn,
        password: password
      }
  ); 
};
