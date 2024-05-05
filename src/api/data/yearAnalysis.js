import axios from "axios";

export const yearDataAnalysis = async (year,token) => {
    return await axios.get(
    `http://localhost:3001/data/listYear/${year}`,{
      headers: {
        authorization: `${token}` 
      }
    }
  );
 
};