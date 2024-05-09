import axios from "axios";

export const yearDataAnalysis = async (year,token) => {
    return await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/data/listYear/${year}`,{
      headers: {
        authorization: `${token}` 
      }
    }
  );
};