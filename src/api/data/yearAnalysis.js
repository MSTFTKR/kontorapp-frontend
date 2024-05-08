import axios from "axios";

export const yearDataAnalysis = async (year,token) => {
    return await axios.get(
    `http://192.168.1.144:3001/data/listYear/${year}`,{
      headers: {
        authorization: `${token}` 
      }
    }
  );
};