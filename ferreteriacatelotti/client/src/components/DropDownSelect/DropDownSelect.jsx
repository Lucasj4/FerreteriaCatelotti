import React, { useState, useRef, useEffect } from "react";
import "./DropDownSelect.css";

const DropdownSelect = ({ options = [], value, onChange, placeholder }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value ? value.label : "");
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
    setSearchTerm(value ? value.label : ""); // Sincroniza searchTerm con el valor seleccionado
  }, [value]);

  const filteredOptions = options.filter((option) => {
    const label = option.label || ""; // Asegúrate de que label sea un string
    const term = searchTerm ? String(searchTerm).toLowerCase() : ""; // Convierte searchTerm a string
    return label.toLowerCase().includes(term);
  });

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
  };

  const handleOptionClick = (option) => {
    onChange(option); // Pasa el objeto completo
    setSearchTerm(option.label); // Solo actualiza el label en searchTerm
    setShowDropdown(false); // Cierra el dropdown inmediatamente
  };

  return (
    <div className="select-container" ref={dropdownRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange} // Actualiza searchTerm mientras escribes
        className="select-display"
        onClick={handleToggleDropdown}
      />
      {showDropdown && (
        <div className="select-dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(option)}
                className="select-option"
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="select-option no-match">
             No encontrado
             
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;
