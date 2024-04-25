import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";

export default function BasicSelect(props) {
  const [years, setYears] = useState([]);
  const months = [
    { value: 1, label: "Ocak" },
    { value: 2, label: "Şubat" },
    { value: 3, label: "Mart" },
    { value: 4, label: "Nisan" },
    { value: 5, label: "Mayıs" },
    { value: 6, label: "Haziran" },
    { value: 7, label: "Temmuz" },
    { value: 8, label: "Ağustos" },
    { value: 9, label: "Eylül" },
    { value: 10, label: "Ekim" },
    { value: 11, label: "Kasım" },
    { value: 12, label: "Aralık" },
  ];
  const weeks = [
    { value: 1, label: "1.Hafta" },
    { value: 2, label: "2.Hafta" },
    { value: 3, label: "3.Hafta" },
    { value: 4, label: "4.Hafta" },
  ];
 
  useEffect(() => {
    generateYears();
  }, []);

  function generateYears() {
    const currentYear = new Date().getFullYear();
    const gnrtYears = [];
    for (let year = 2020; year <= currentYear; year++) {
      gnrtYears.push({ value: year, label: year.toString() });
    }
    setYears(gnrtYears);
  }

  return (
    <Box sx={{ width: "200px" }}>
      <Typography sx={{ fontWeight: "bold" }}>{props.title}</Typography>
      <FormControl fullWidth>
        <InputLabel>{props.label}</InputLabel>
        <Select
          value={props.value}
          label={props.label}
          onChange={
            props.onChange}
        >
          {props.menuItems === "year"
            ?years.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))
            : props.menuItems === "month"
            ? months.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))
            : weeks.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
        </Select>
      </FormControl>
    </Box>
  );
}
