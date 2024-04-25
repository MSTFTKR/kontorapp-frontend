import { useEffect, useState } from "react";
import "./App.css";
import { Grid, Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { dataList } from "./api/data/dataList";
import moment from "moment";
import "moment/locale/tr";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import BasicSelect from "./components/selectBox";

function App() {
  const [colDefs, setColDefs] = useState([
    { headerName: "Toplam Kontor", field: "alinanKontor" },
    { headerName: "Kullanılan Kontor", field: "kullanilanKontor" },
    { headerName: "Kalan Kontor", field: "kalanKontor" },
    {
      headerName: "Tarih",
      field: "date",
      valueFormatter: (params) => {
        moment.locale("tr");
        return moment(params.value).format("DD.MM.YYYY");
      },
    },
  ]);

  const [yearValue, setYearValue] = useState(new Date().getFullYear());
  const [monthValue, setMonthValue] = useState(new Date().getMonth() + 1);
  const [weekValue, setWeekValue] = useState("");

  const [data, setData] = useState([]);

  const [dateRangeLast, setDateRangeLast] = useState(moment());
  const [dateRangeFirst, setDateRangeFirst] = useState(
    moment().startOf("month")
  );

  useEffect(() => {
    dataList(dateRangeFirst, dateRangeLast)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log("Data çekilemedi", err);
      });
    currentWeek();
    
  }, []);

  const filterData = () => {
    dataList(dateRangeFirst, dateRangeLast)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log("Data çekilemedi", err);
      });
  };

  const handleYear = (event) => {
    setYearValue(event.target.value);
  };
  const handleMonth = (event) => {
    setMonthValue(event.target.value);
  };
  const handleWeek = (event) => {
    setWeekValue(event.target.value);
  };

  const currentWeek = () => {
    const today = moment();
    const currentMonth = today.month();
    const startOfMonth = moment().month(currentMonth).startOf("month");
    let currentWeekOfMonth = today.isoWeek() - startOfMonth.isoWeek() + 1;
    if(currentWeekOfMonth==5){currentWeekOfMonth=4}
    setWeekValue(currentWeekOfMonth);
  };
  return (
    <Grid container sx={{ flexDirection: "column" }}>
      <button
        onClick={() => rangeAverage(filterData, dateRangeFirst, dateRangeLast)}
      >
        YILLIK
      </button>

      <Grid sx={{ display: "flex", gap: 3, justifyContent: "space-between" }}>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            marginBottom: "30px",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <BasicSelect
            title="YILLIK VERİLER"
            label="YIL"
            menuItems="year"
            value={yearValue}
            onChange={handleYear}
          />
          {yearValue}
          <Typography>Aylık Ort. Kullanım:</Typography>
          <Typography>Haftalık Ort Kullanım:</Typography>
          <Typography>Günlük Ort. Kullanım:</Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            marginBottom: "30px",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <BasicSelect
            title="AYLIK VERİLER"
            label="AY"
            menuItems="month"
            value={monthValue}
            onChange={handleMonth}
          />
          {monthValue}
          <Typography>Haftalık Ort. Kullanım:</Typography>
          <Typography>Günlük Ort. Kullanım:</Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            marginBottom: "30px",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <BasicSelect
            title="HAFTALIK VERİLER"
            label="HAFTA"
            menuItems="week"
            value={weekValue}
            onChange={handleWeek}
          />
          {weekValue}
          <Typography>Günlük Ort. Kullanım:</Typography>
        </Grid>
      </Grid>

      <Grid sx={{ display: "flex", gap: "10px" }}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="tr">
          <DemoContainer components={["DatePicker"]}></DemoContainer>
          <DatePicker
            label="Başlangıç Tarihi"
            value={dateRangeFirst}
            onChange={(sDate) => setDateRangeFirst(sDate)}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="tr">
          <DemoContainer components={["DatePicker"]}></DemoContainer>
          <DatePicker
            label="Biriş Tarihi"
            value={dateRangeLast}
            onChange={(eDate) => setDateRangeLast(eDate)}
          />
        </LocalizationProvider>

        <button onClick={() => filterData(dateRangeFirst, dateRangeLast)}>
          <SearchIcon></SearchIcon>
        </button>
      </Grid>
      {/* 
      <Grid>
        <div className="ag-theme-quartz" style={{ height: "300px" }}>
          <AgGridReact rowData={data} columnDefs={colDefs} />
        </div>
      </Grid> */}

      <Grid>
        <div className="ag-theme-quartz" style={{ height: "300px" }}>
          <AgGridReact rowData={data} columnDefs={colDefs} />
        </div>
      </Grid>
    </Grid>
  );
}

export default App;
