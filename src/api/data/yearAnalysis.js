import axios from "axios";

export const yearDataAnalysis = async (year) => {
    return await axios.get(
    `http://localhost:3001/data/listYear/${year}`
  );
 
};