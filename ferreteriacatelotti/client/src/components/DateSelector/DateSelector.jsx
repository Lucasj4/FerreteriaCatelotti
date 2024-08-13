import React, { useState, useEffect } from "react";
import "./DateSelector.css";



const DateSelector = ({ fetchDataByDate, setFilas }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  
  useEffect(() => {
    // Llama a fetchDataByDate cuando las fechas cambien
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    const fromDate = dateRange[0].startDate.toISOString().split("T")[0];
    const toDate = dateRange[0].endDate.toISOString().split("T")[0];
    await fetchDataByDate(fromDate, toDate);
  };

  return (
    <div className="dateselector">
      <p className="dateselector__title">Fecha</p>
      <div className="dateselector__container">
        <div className="dateselector__item">
          <p>Desde</p>
          <input
            type="date"
            id="startDate"
            className="dateselector__date"
            value={dateRange[0].startDate.toISOString().split("T")[0]}
            onChange={(e) => {
              const newStartDate = new Date(e.target.value);
              setDateRange([
                {
                  startDate: newStartDate,
                  endDate: dateRange[0].endDate,
                  key: "selection",
                },
              ]);
            }}
          />
        </div>
        <div className="dateselector__item">
          <p>Hasta</p>
          <input
            type="date"
            id="endDate"
            className="dateselector__date"
            value={dateRange[0].endDate.toISOString().split("T")[0]}
            onChange={(e) => {
              const newEndDate = new Date(e.target.value);
              setDateRange([
                {
                  startDate: dateRange[0].startDate,
                  endDate: newEndDate,
                  key: "selection",
                },
              ]);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
