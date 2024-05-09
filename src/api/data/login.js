import axios from "axios";

export const login = async (tcVkn,password) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        tcVkn: tcVkn,
        password: password
      }
  ); 
};
