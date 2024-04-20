
const rangeAverage = (filterData, dateRangeFirst, dateRangeLast)  => {
    console.log(filterData)
    let rangeDiff = 1;
    let alinanToplam = 0;
    let alinanOrt = 0;
    let kullanilanToplam = 0;
    let kullanilanOrt = 0;
    alinanToplam =
      filterData[filterData.length - 1].alinanKontor -
      filterData[0].alinanKontor;
    kullanilanToplam =
      filterData[filterData.length - 1].kullanilanKontor -
      filterData[0].kullanilanKontor;

    rangeDiff = dateRangeLast.diff(dateRangeFirst, "days") + 1;
    alinanOrt = alinanToplam / rangeDiff;
    kullanilanOrt = kullanilanToplam / rangeDiff;
    console.log(alinanOrt);
    console.log(kullanilanOrt);
  };

const yearAverageCalculate = (data) => {
    const dateYearRange = data.filter((items) => {
      let firstDate;
      let lastDate;
      if (
        new Date(items.date) >= new Date(firstDate) &&
        new Date(items.date) <= new Date(lastDate)
      ) {
        return items;
      }
    });
  };


export default {rangeAverage,yearAverageCalculate};