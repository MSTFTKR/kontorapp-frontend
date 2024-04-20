import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";

export default function BasicSelect(props) {
  const [yearValue, setYearValue] = useState("");
  const [monthValue, setMonthValue] = useState(new Date().getMonth() + 1);
  const [weekValue, setWeekValue] = useState("");

  const [years, setYears] = useState([]);

  useEffect(() => {
    generateYears();
    getCurrentWeekNumber();
  }, []);

  const handleYear = (event) => {
    setYearValue(event.target.value);
  };
  const handleMonth = (event) => {
    setMonthValue(event.target.value);
  };
  const handleWeek = (event) => {
    setWeekValue(event.target.value);
  };
  const monthNames = [
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

  function getCurrentWeekNumber() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const pastDaysOfMonth = (today - firstDayOfMonth) / 86400000;
    let currentWeek = Math.ceil(
      (pastDaysOfMonth + firstDayOfMonth.getDay() + 1) / 7
    );
    setWeekValue(currentWeek);
  }

  function generateYears() {
    const currentYear = new Date().getFullYear();
    const gnrtYears = [];
    for (let year = 2020; year <= currentYear; year++) {
      gnrtYears.push({ value: year, label: year.toString() });
    }
    setYears(gnrtYears);
    setYearValue(gnrtYears[gnrtYears.length - 1].label);
  }

  return (
    <Box sx={{ width: "200px" }}>
      <Typography sx={{ fontWeight: "bold" }}>{props.title}</Typography>
      <FormControl fullWidth>
        <InputLabel>{props.label}</InputLabel>
        <Select
          value={
            props.menuItems === "year"
              ? yearValue
              : props.menuItems === "month"
              ? monthValue
              : weekValue
          }
          label={props.label}
          onChange={
            props.menuItems === "year"
              ? handleYear
              : props.menuItems === "month"
              ? handleMonth
              : handleWeek
          }
        >
          {props.menuItems === "year"
            ? years.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))
            : props.menuItems === "month"
            ? monthNames.map((item) => (
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
