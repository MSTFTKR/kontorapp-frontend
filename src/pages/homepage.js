import { useEffect, useState } from "react";
import "../App.css";
import { Button, Grid, Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { dataList } from "../api/data/dataList";
import { yearDataAnalysis } from "../api/data/yearAnalysis";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import BasicSelect from "../components/selectBox";
import { LineChart } from "../components/lineCharts";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
function Homepage() {
  const navigate = useNavigate();
  const [tokenFlag, setTokenFlag] = useState(false);
  const [colDefs, setColDefs] = useState([
    { headerName: "Toplam Kontor", field: "alinanKontor" },
    { headerName: "Kullanılan Kontor", field: "kullanilanKontor" },
    { headerName: "Kalan Kontor", field: "kalanKontor" },
    {
      headerName: "Tarih",
      field: "date",
      valueFormatter: (params) => {
        return moment.utc(params.value).format("DD.MM.YYYY:HH:mm");
      },
    },
  ]);

  const [yearValue, setYearValue] = useState(new Date().getFullYear());
  const [yearFlag, setYearFlag] = useState(0);

  const [monthValue, setMonthValue] = useState(new Date().getMonth() + 1);
  const [weekValue, setWeekValue] = useState(
    Math.ceil(moment().date() / 7) === 5 ? 4 : Math.ceil(moment().date() / 7)
  );

  const [data, setData] = useState([]);
  const [yearAnalysis, setyearAnalysis] = useState([]);
  const [monthAnalysis, setmonthAnalysis] = useState([]);
  const [monthChartAnalysis, setMonthChartAnalysis] = useState([]);

  const [weekAnalysis, setweekAnalysis] = useState([]);
  const [weekChartAnalysis, setWeekChartAnalysis] = useState([]);

  const [rangeAnalysis, setRangeAnalysis] = useState([]);

  const [dateRangeLast, setDateRangeLast] = useState(moment());
  const [dateRangeFirst, setDateRangeFirst] = useState(
    moment().startOf("month")
  );

  useEffect(() => {
    const login = Cookies.get("authToken");
    if (!login) {
      navigate("/");
    } else {
      setTokenFlag(true);
    }
    dataList(dateRangeFirst, dateRangeLast, login)
      .then((res) => {
        setData(res.data.rangeDatas);
        setRangeAnalysis(res.data.rangesAnalysisData);
      })
      .catch((err) => {
        console.log("Data çekilemedi", err);
      });

    yearDataAnalysis(yearValue, login)
      .then((res) => {
        setyearAnalysis(res.data);
        // console.log(res.data)
      })
      .catch((err) => {
        console.log("Data çekilemedi", err);
      });

    console.log(yearAnalysis);

    currentWeek();
  }, []);

  useEffect(() => {
    const login = Cookies.get("authToken");
    if (!login) {
      navigate("/");
    } else {
      setTokenFlag(true);
    }
    if (yearFlag === 1) {
      yearDataAnalysis(yearValue, login)
        .then((res) => {
          setyearAnalysis(res.data);
          console.log(res);
          setmonthAnalysis(res.data.months.monthsData[monthValue]);
          setMonthChartAnalysis(
            filterKeysStarting(res.data.months.lastWeekItemsByKey, "month")
          );
          setWeekChartAnalysis(
            filterKeysStarting(res.data.weeks.daysOfWeekDatas, "week")
          );
          setweekAnalysis(
            res.data.weeks.weeksData[`${monthValue}${weekValue}`]
          );
        })
        .catch((err) => {
          setyearAnalysis({});
          setmonthAnalysis({});
          setMonthChartAnalysis({});
          setWeekChartAnalysis({});
          setweekAnalysis({});
          console.log("Data çekilemedi", err);
        });
    }
  }, [yearValue]);

  const filterKeysStarting = (data, params) => {
    if (params === "month") {
      let result = {};
      for (var key in data) {
        if (key.toString().startsWith(monthValue)) {
          result[key] = data[key];
        }
      }
      // console.log(result)
      return result;
    } else if (params === "week") {
      let result = {};
      for (var key in data) {
        if (key.toString().startsWith(monthValue)) {
          result[key] = data[key];
        }
      }
      let result2 = [];
      for (var key in result) {
        if (key.toString().endsWith(weekValue)) {
          result2.push(result[key]);
        }
      }
      return [].concat.apply([], result2);
    }
  };

  useEffect(() => {
    let chooseMonth = yearAnalysis?.months?.monthsData[monthValue];
    setmonthAnalysis(chooseMonth);

    let chooseWeek =
      yearAnalysis?.weeks?.weeksData[`${monthValue}${weekValue}`];

    setweekAnalysis(chooseWeek);
    setMonthChartAnalysis(
      filterKeysStarting(yearAnalysis?.months?.lastWeekItemsByKey, "month")
    );
    setWeekChartAnalysis(
      filterKeysStarting(yearAnalysis?.weeks?.daysOfWeekDatas, "week")
    );
  }, [monthValue]);

  useEffect(() => {
    let chooseWeek =
      yearAnalysis?.weeks?.weeksData[`${monthValue}${weekValue}`];
    setweekAnalysis(chooseWeek);
    setWeekChartAnalysis(
      filterKeysStarting(yearAnalysis?.weeks?.daysOfWeekDatas, "week")
    );
  }, [weekValue]);

  const rangeDatas = () => {
    const login = Cookies.get("authToken");
    if (!login) {
      navigate("/");
    } else {
      setTokenFlag(true);
    }
    dataList(dateRangeFirst, dateRangeLast, login)
      .then((res) => {
        setData(res.data.rangeDatas);
        setRangeAnalysis(res.data.rangesAnalysisData);
      })
      .catch((err) => {
        console.log("Data çekilemedi", err);
      });
  };

  const handleYear = (event) => {
    setYearValue(event.target.value);
    setYearFlag(1);
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
    if (currentWeekOfMonth == 5) {
      currentWeekOfMonth = 4;
    }
    setWeekValue(currentWeekOfMonth);
  };

  const logout = () => {
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "usertcVkn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  return (
    <Grid
      container
      sx={{
        flexDirection: "column",
        display: tokenFlag === true ? "flex" : "none",
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#211bbb",
        }}
      >
        <Typography sx={{ color: "#ffffff" }}>
          Alınan Kontör:{" "}
          {yearAnalysis?.year?.yearsData?.yearCurrentReceived
            ? yearAnalysis?.year?.yearsData?.yearCurrentReceived
            : "0"}{" "}
          {"-"} Kullanılan Kontör:{" "}
          {yearAnalysis?.year?.yearsData?.yearCurrentUsage
            ? yearAnalysis?.year?.yearsData?.yearCurrentUsage
            : "0"}{" "}
          {"-"} Kalan Kontör:{" "}
          {yearAnalysis?.year?.yearsData?.yearCurrentRemaining
            ? yearAnalysis?.year?.yearsData?.yearCurrentRemaining
            : "0"}
        </Typography>

        <Button onClick={logout}>ÇIKIŞ YAP</Button>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          gap: 3,
          justifyContent: "space-between",
          margin: "1%",
        }}
      >
        <Grid item xs={4} className="gridBorder">
          <Grid sx={{display:"flex",flexDirection:"column"}}>
            <Typography variant="textColor">
              Toplam Alınan Kontör:
              {yearAnalysis?.year?.yearsData?.yearTotalReceived
                ? yearAnalysis?.year?.yearsData?.yearTotalReceived
                : "0"}
            </Typography>
            <Typography variant="textColor">
              Toplam Kullanım Kontör:
              {yearAnalysis?.year?.yearsData?.yearTotalUsage
                ? yearAnalysis?.year?.yearsData?.yearTotalUsage
                : "0"}
            </Typography>
            <Grid item xs={12} className="BasicSelect">
              <BasicSelect
                title="YILLIK VERİLER"
                label="YIL"
                menuItems="year"
                value={yearValue}
                onChange={handleYear}
              />
            </Grid>

            <Typography>
              Aylık Ort. Alım:
              {yearAnalysis?.year?.yearsData?.yearTotalReceivedMonthAvg
                ? yearAnalysis?.year?.yearsData?.yearTotalReceivedMonthAvg
                : "0"}
            </Typography>
            <Typography>
              Haftalık Ort Alım:
              {yearAnalysis?.year?.yearsData?.yearTotalReceivedWeekAvg
                ? yearAnalysis?.year?.yearsData?.yearTotalReceivedWeekAvg
                : "0"}
            </Typography>
            <Typography>
              Günlük Ort. Alım:
              {yearAnalysis?.year?.yearsData?.yearTotalReceivedDayAvg
                ? yearAnalysis?.year?.yearsData?.yearTotalReceivedDayAvg
                : "0"}
            </Typography>

            <Typography>
              Aylık Ort. Kullanım:
              {yearAnalysis?.year?.yearsData?.yearTotalUsageMonthAvg
                ? yearAnalysis?.year?.yearsData?.yearTotalUsageMonthAvg
                : "0"}
            </Typography>
            <Typography>
              Haftalık Ort Kullanım:
              {yearAnalysis?.year?.yearsData?.yearTotalUsageWeekAvg
                ? yearAnalysis?.year?.yearsData?.yearTotalUsageWeekAvg
                : "0"}
            </Typography>
            <Typography>
              Günlük Ort. Kullanım:
              {yearAnalysis?.year?.yearsData?.yearTotalUsageDayAvg
                ? yearAnalysis?.year?.yearsData?.yearTotalUsageDayAvg
                : "0"}
            </Typography>
          </Grid>

          <Grid>
            <LineChart
              data={yearAnalysis?.year?.lastMonthItemsByKey}
              category="year"
            />
          </Grid>
        </Grid>
        <Grid item xs={4} className="gridBorder">
          <Grid sx={{display:"flex",flexDirection:"column"}}>
            <Typography>
              Toplam Alınan Kontör:
              {monthAnalysis?.monthTotalReceived
                ? monthAnalysis?.monthTotalReceived
                : "0"}
            </Typography>
            <Typography>
              Toplam Kullanılan Kontör:
              {monthAnalysis?.monthTotalUsage
                ? monthAnalysis?.monthTotalUsage
                : "0"}
            </Typography>
            <Grid item xs={12} className="BasicSelect">
              <BasicSelect
                title="AYLIK VERİLER"
                label="AY"
                menuItems="month"
                value={monthValue}
                onChange={handleMonth}
              />
            </Grid>

            <Typography>
              Haftalık Ort Alım:
              {monthAnalysis?.monthTotalReceivedWeekAvg
                ? monthAnalysis?.monthTotalReceivedWeekAvg
                : "0"}
            </Typography>
            <Typography>
              Günlük Ort. Alım:
              {monthAnalysis?.monthTotalReceivedDayAvg
                ? monthAnalysis?.monthTotalReceivedDayAvg
                : "0"}
            </Typography>

            <Typography>
              Haftalık Ort Kullanım:
              {monthAnalysis?.monthTotalUsageWeekAvg
                ? monthAnalysis?.monthTotalUsageWeekAvg
                : "0"}
            </Typography>
            <Typography>
              Günlük Ort. Kullanım:
              {monthAnalysis?.monthTotalUsageDayAvg
                ? monthAnalysis?.monthTotalUsageDayAvg
                : "0"}
            </Typography>
          </Grid>

          <Grid xs={12}>
            <LineChart data={monthChartAnalysis} category="month" />
          </Grid>
        </Grid>
        <Grid item xs={4} className="gridBorder">
          <Grid>
            <Typography>
              Toplam Alınan Kontör:
              {weekAnalysis?.weekTotalReceived
                ? weekAnalysis?.weekTotalReceived
                : "0"}
            </Typography>
            <Typography>
              Toplam Kullanılan Kontör:
              {weekAnalysis?.weekTotalUsage
                ? weekAnalysis?.weekTotalUsage
                : "0"}
            </Typography>
            <Grid item xs={12} className="BasicSelect">
              <BasicSelect
                title="HAFTALIK VERİLER"
                label="HAFTA"
                menuItems="week"
                value={weekValue}
                onChange={handleWeek}
              />
            </Grid>

            <Typography>
              Günlük Ort. Alım:
              {weekAnalysis?.weekTotalReceivedDayAvg
                ? weekAnalysis?.weekTotalReceivedDayAvg
                : "0"}
            </Typography>
            <Typography>
              Günlük Ort. Kullanım:
              {weekAnalysis?.weekTotalUsageDayAvg
                ? weekAnalysis?.weekTotalUsageDayAvg
                : "0"}
            </Typography>
          </Grid>
          <Grid>
            <LineChart data={weekChartAnalysis} category="week" />
          </Grid>
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

        <button onClick={() => rangeDatas(dateRangeFirst, dateRangeLast)}>
          <SearchIcon></SearchIcon>
        </button>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          marginTop: "1%",
        }}
      >
        <Grid xs={8}>
          <div
            className="ag-theme-quartz"
            style={{ height: "100%", width: "100%" }}
          >
            <AgGridReact
              rowData={data}
              columnDefs={colDefs}
              overlayNoRowsTemplate="<span style='padding: 10px; display: block; text-align: center;'>Bu aralığa ait hiç veri yok</span>"
            />
          </div>
        </Grid>

        <Grid item xs={4} className="gridBorder">
          <Typography>
            Toplam Alınan Kontör:
            {rangeAnalysis?.rangeTotalReceived
              ? rangeAnalysis?.rangeTotalReceived
              : "0"}
          </Typography>
          <Typography>
            Toplam Kullanılan Kontör:
            {rangeAnalysis?.rangeTotalUsage
              ? rangeAnalysis?.rangeTotalUsage
              : "0"}
          </Typography>
          <Typography fontWeight="bold">SEÇİLİ ARALIK VERİLERİ</Typography>
          <Typography>
            Haftalık Ort Alım:
            {rangeAnalysis?.rangeTotalReceivedWeekAvg
              ? rangeAnalysis?.rangeTotalReceivedWeekAvg
              : "0"}
          </Typography>
          <Typography>
            Günlük Ort. Alım:
            {rangeAnalysis?.rangeTotalReceivedDayAvg
              ? rangeAnalysis?.rangeTotalReceivedDayAvg
              : "0"}
          </Typography>

          <Typography>
            Haftalık Ort Kullanım:
            {rangeAnalysis?.rangeTotalUsageWeekAvg
              ? rangeAnalysis?.rangeTotalUsageWeekAvg
              : "0"}
          </Typography>
          <Typography>
            Günlük Ort. Kullanım:
            {rangeAnalysis?.rangeTotalUsageDayAvg
              ? rangeAnalysis?.rangeTotalUsageDayAvg
              : "0"}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Homepage;
