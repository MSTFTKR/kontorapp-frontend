import axios from "axios";

export const dataList = async (startDate, endDate) => {
  return await axios.get(
    `http://localhost:3001/data/rangeList?startDate=${
      startDate.toISOString().split("T")[0]
    }&endDate=${endDate.toISOString().split("T")[0]}`
  );
};
