import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './MultipleSelect.css';

const MultiSelectOption = ({ options, selectedProveedores, onChange, placeholder }) => {
  const [formattedOptions, setFormattedOptions] = useState([]);

  useEffect(() => {
    if (options && options.length > 0) {
      // Map the options to react-select's expected format
      const mappedOptions = options.map(supplier => ({
        value: supplier._id,
        label: supplier.lastName,
      }));
      setFormattedOptions(mappedOptions);
    }
  }, [options]);





  return (
    <Select
      isMulti
      options={formattedOptions}
      value={selectedProveedores}
      onChange={onChange}
      placeholder={placeholder}
      className="custom-multi-select"
    />
  );
};

export default MultiSelectOption;