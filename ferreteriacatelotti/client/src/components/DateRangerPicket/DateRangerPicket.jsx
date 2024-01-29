import React from 'react'

const DateRangerPicket = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
  
    const handleDateChange = (date) => {
      if (!startDate) {
        setStartDate(date);
      } else if (!endDate && date > startDate) {
        setEndDate(date);
      } else {
        setStartDate(date);
        setEndDate(null);
      }
    };
  
    return (
      <div>
        <label>Desde:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => handleDateChange(e.target.value)}
        />
  
        <label>Hasta:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => handleDateChange(e.target.value)}
        />
      </div>
    );
}

export default DateRangerPicket