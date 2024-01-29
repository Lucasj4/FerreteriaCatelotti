import React, { useState } from 'react';
import Select from 'react-select';
import './MultipleSelect.css'

const MultiSelectOption = ({ options, selectedProveedores, onChange,placeholder }) => {
  return (
    <Select
      isMulti
      options={options}
      value={selectedProveedores}
      onChange={onChange}
      placeholder={placeholder}
      className="custom-multi-select"
    />
  );
};

export default MultiSelectOption;
