import React from "react";
import "./DateRangerPicket.css"; // Opcional: agrega estilos para el componente.

const DateRangePicker = ({ dateRange, setDateRange }) => {
  return (
    <div className="dateselector__container">
      <div className="dateselector__item">
        <p>Desde</p>
        <input
          type="date"
          value={dateRange[0].startDate.toISOString().split("T")[0]}
          onChange={(e) => {
            const newStartDate = new Date(e.target.value);
            setDateRange({ ...dateRange, startDate: newStartDate });
          }}
        />
      </div>
      <div className="dateselector__item">
        <p>Hasta</p>
        <input
          type="date"
          value={dateRange[0].endDate.toISOString().split("T")[0]}
          onChange={(e) => {
            const newEndDate = new Date(e.target.value);
            setDateRange({ ...dateRange, endDate: newEndDate });
          }}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
