import axios from "axios";


export const dataList=async()=>{

return await axios.get('http://localhost:3001/data/listData')
}



