// DropdownSelect.js
import React, { useState, useRef, useEffect } from "react";
import "./DropdownSelect.css";

const DropdownSelect = ({ options, value, onChange, placeholder }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);
  
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="select-container" ref={dropdownRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm || value}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="select-display"
        onClick={handleToggleDropdown}
      />
      {showDropdown && (
        <div className="select-dropdown">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                onChange(option);
                setSearchTerm(option);
                setShowDropdown(false);
              }}
              className="select-option"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;
