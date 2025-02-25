import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./MultipleSelect.css";

const MultiSelectOption = ({ options, selectedOptions, onChange, placeholder, labelKey = "lastName" }) => {
  const [formattedOptions, setFormattedOptions] = useState([]);

  useEffect(() => {
    if (options && options.length > 0) {
      const mappedOptions = options.map((item) => ({
        value: item._id,
        label: item[labelKey], // Usar el campo especificado por labelKey
      }));
      setFormattedOptions(mappedOptions);
    }
  }, [options, labelKey]);

  return (
    <Select
      options={formattedOptions}
      value={selectedOptions}
      onChange={onChange}
      placeholder={placeholder}
      className="custom-multi-select"
    />
  );
};

export default MultiSelectOption;