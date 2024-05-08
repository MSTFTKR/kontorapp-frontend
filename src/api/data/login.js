import axios from "axios";

export const login = async (tcVkn,password) => {
  return await axios.post(
    `http://192.168.1.144:3001/auth/login`, {
        tcVkn: tcVkn,
        password: password
      }
  ); 
};
