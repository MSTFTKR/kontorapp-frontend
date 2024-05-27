import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";
import "moment/locale/tr";
import { Grid } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function LineChart(props) {
  moment.locale("tr");

  const [analysisDatas, setanalysisDatas] = useState({});
  const [lastMonth, setLastMonth] = useState();
  const [lastWeek, setLastWeek] = useState();
  const [lastDay, setLastDay] = useState();

  const [months, setMonths] = useState(["Ocak"]);
  const [weeks, setWeeks] = useState(["1.Hafta"]);
  const [days, setDays] = useState(["1.Gün"]);

  const [usageDatas, setUsageDatas] = useState([]);
  const [receivedDatas, setReceivedDatas] = useState([]);

  useEffect(() => {
    setanalysisDatas(props.data);
  }, [props.data]);

  useEffect(() => {
    if (analysisDatas) {
      if (props.category === "year") {
        let keys = Object.keys(analysisDatas);
        keys = Number(keys[keys.length - 1]);
        setLastMonth(keys);
      } else if (props.category === "month") {
        let keys = Object.keys(analysisDatas);
        var lastKey = Math.max(...keys);
        setLastWeek(lastKey % 10);
      } else if (props.category === "week") {
        let lDay = analysisDatas[analysisDatas.length - 1]?.date;
        lDay = moment.utc(lDay).format("DD");
        lDay = Number(lDay);
        if (lDay > 28) {
          lDay = lDay - 21;
        } else if (lDay % 7 === 0) {
          lDay = 7;
        } else {
          lDay = lDay % 7;
        }

        setLastDay(lDay);
      }
    }
  }, [analysisDatas]);

  useEffect(() => {
    if (props.category === "year") {
      const monthArray = [...Array(lastMonth ? lastMonth : 1).keys()].map(
        (_, index) => moment().month(index).format("MMMM")
      );
      monthArray.unshift("");
      let uDatas = [];
      let rDatas = [];
      let lastUDatas = 0;
      let lastRDatas = 0;

      for (let index = 0; index <= lastMonth; index++) {
        if (analysisDatas.hasOwnProperty(index)) {
          uDatas.push(analysisDatas[index].alinanKontor);
          rDatas.push(analysisDatas[index].kullanilanKontor);
          lastUDatas = analysisDatas[index].alinanKontor;
          lastRDatas = analysisDatas[index].kullanilanKontor;
        } else {
          uDatas.push(lastUDatas);
          rDatas.push(lastRDatas);
        }
      }
      setReceivedDatas(rDatas);
      setUsageDatas(uDatas);
      setMonths(monthArray);
    } else if (props.category === "month") {
      let week = [];
      // console.log(analysisDatas)

      for (let a = 1; a <= lastWeek; a++) {
        week.push(`${a}.Hafta`);
      }
      week.unshift(0);
      let uDatas = [];
      let rDatas = [];
      let lastUDatas = 0;
      let lastRDatas = 0;
      let keys = Object.keys(analysisDatas);

      let lastKey = Math.max(...keys);

      let firstMonth = lastKey.toString();
      if (firstMonth.length === 3) {
        firstMonth = Number(firstMonth[0] + firstMonth[1] + "0");
      } else {
        firstMonth = Number(firstMonth[0] + "0");
      }

      // console.log(firstMonth)
      for (let a = firstMonth; a <= lastKey; a++) {
        if (analysisDatas.hasOwnProperty(a)) {
          uDatas.push(analysisDatas[a].alinanKontor);
          rDatas.push(analysisDatas[a].kullanilanKontor);
          lastUDatas = analysisDatas[a].alinanKontor;
          lastRDatas = analysisDatas[a].kullanilanKontor;
        } else {
          uDatas.push(lastUDatas);
          rDatas.push(lastRDatas);
        }
      }
      setReceivedDatas(rDatas);
      setUsageDatas(uDatas);

      setWeeks(week);
    } else if (props.category === "week") {
      let day = [];

      for (let a = 0; a <= lastDay; a++) {
        day.push(`${a}`);
      }
      let uDatas = [];
      let rDatas = [];
      let lastUDatas = 0;
      let lastRDatas = 0;
      uDatas.push(analysisDatas[0]?.alinanKontor);
      rDatas.push(analysisDatas[0]?.kullanilanKontor);
      lastUDatas = analysisDatas[0]?.alinanKontor;
      lastRDatas = analysisDatas[0]?.kullanilanKontor;
      let lDay = analysisDatas[analysisDatas.length - 1]?.date;
      lDay = moment.utc(lDay).format("DD");
      lDay = Number(lDay);

      let firstDay;
      if (lDay < 8) {
        firstDay = 1;
      } else if (lDay < 15) {
        firstDay = 8;
      } else if (lDay < 22) {
        firstDay = 15;
      } else {
        firstDay = 22;
      }

      for (let b = firstDay; b <= lDay; b++) {
        // console.log(b)
        let found = false; // Her bir gün için verinin bulunup bulunmadığını kontrol etmek için bir bayrak
        for (let a = 0; a < analysisDatas?.length; a++) {
          // console.log(a)
          let dateControl = moment.utc(analysisDatas[a].date).format("DD");
          dateControl = Number(dateControl);
          // console.log(dateControl)
          if (dateControl === b) {
            uDatas.push(analysisDatas[a].alinanKontor);
            rDatas.push(analysisDatas[a].kullanilanKontor);
            lastUDatas = analysisDatas[a].alinanKontor;
            lastRDatas = analysisDatas[a].kullanilanKontor;
            found = true; // Veri bulunduğunda bayrağı true yap
            break; // Veri bulunduğunda içteki döngüyü sonlandır
          }
        }
        if (!found) {
          // Veri bulunmadığında
          uDatas.push(lastUDatas); // Son bilgileri ekleyin
          rDatas.push(lastRDatas);
        }
      }
      setReceivedDatas(rDatas);
      setUsageDatas(uDatas);
      setDays(day);
    }
  }, [lastMonth, lastWeek, lastDay]);

  const options = {
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)' // X ekseni için ızgara çizgilerinin rengi
        }
      },
      y: {
        ticks: {
          color: "#ffffff",
        },grid: {
          color: 'rgba(255, 255, 255, 0.3)' // X ekseni için ızgara çizgilerinin rengi
        }
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#ffffff",
        },
        backgroundColor: "white",
      },
      title: {
        display: true,
        text: props.title,
        color: "#ffffff",
      },
    },
  };

  const labels =
    props.category === "year"
      ? months
      : props.category === "month"
      ? weeks
      : days;

  const data = {
    labels,
    datasets: [
      {
        label: "Alınan Kontor",
        data: receivedDatas,
        borderColor: "#ff0011",
        backgroundColor: "#fffaf2",
      },
      {
        label: "Kullanılan Kontor",
        data: usageDatas,
        borderColor: "#08beff",
        backgroundColor: "#d8fdf4",
      },
    ],
  };

  return (
    <Grid xs={12} style={{display:"flex", borderRadius:"5px", backgroundColor: "#2E4053", alignItems:"center", justifyContent:"center", width:"auto", height:"auto" }}>
      <Line options={options} data={data} />
    </Grid>
  );
}
