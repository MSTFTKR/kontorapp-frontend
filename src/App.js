import { useEffect, useState } from "react";
import "./App.css";
import {  Grid, Typography } from "@mui/material";
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
import rangeAverage from "./components/analysis";

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

  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [dateRangeLast, setDateRangeLast] = useState(moment());
  const [dateRangeFirst, setDateRangeFirst] = useState(
    moment().startOf("month")
  );
  const [dayAverage, setDayAverage] = useState();
  const [monthAverage, setMonthAverage] = useState();
  const [yearAverage, setYearAverage] = useState();

  useEffect(() => {
    dataList()
      .then((res) => {
        const filterDate = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setData(filterDate);
        setFilterData(filterDate);
      })
      .catch((err) => {
        console.log("Data çekilemedi", err);
      });
  }, []);

  const convertFilterData = async (firstDate, lastDate) => {
    const dateRange = data.filter((items) => {
      if (
        new Date(items.date) >= new Date(firstDate) &&
        new Date(items.date) <= new Date(lastDate)
      ) {
        return items;
      }
    });

    setFilterData(dateRange);
    console.log(filterData);
  };



  return (
    <Grid container sx={{ flexDirection: "column" }}>
      <Grid sx={{ display: "flex", gap: 3, justifyContent: "space-between" }}>
        <Grid xs={4} sx={{ display: "flex", marginBottom: "30px", flexDirection:"column", alignItems:"center" ,textAlign:"center"}}>
          <BasicSelect title="YILLIK VERİLER" label="YIL" menuItems="year" />
          <Typography>
            Aylık Ortalama Kullanım:
          </Typography>
          <Typography>
            Haftalık Ortalama Kullanım:
          </Typography>
          <Typography>
            Günlük Ortalama Kullanım:
          </Typography>
        </Grid>
        <Grid xs={4} sx={{ display: "flex", marginBottom: "30px", flexDirection:"column", alignItems:"center" ,textAlign:"center"}}>
          <BasicSelect title="AYLIK VERİLER" label="AY" menuItems="month" />
          <Typography>
            Haftalık Ortalama Kullanım: 
          </Typography>
          <Typography>
            Günlük Ortalama Kullanım: 
          </Typography>
        </Grid>
        <Grid xs={4} sx={{ display: "flex", marginBottom: "30px", flexDirection:"column", alignItems:"center" ,textAlign:"center"}}>
          <BasicSelect
            title="HAFTALIK VERİLER"
            label="HAFTA"
            menuItems="week"
          />
          <Typography>
            Günlük Ortalama Kullanım: 
          </Typography>
        </Grid>
      </Grid>

      <button onClick={() => rangeAverage(filterData, dateRangeFirst, dateRangeLast)}>YILLIK</button>

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

        <button
          onClick={() => convertFilterData(dateRangeFirst, dateRangeLast)}
        >
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
          <AgGridReact rowData={filterData} columnDefs={colDefs} />
        </div>
      </Grid>
    </Grid>
  );
}

export default App;
