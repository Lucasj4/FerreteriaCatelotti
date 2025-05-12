import React from "react";
import "./FormItem.css";
const FormItem = ({
  formItemClassName,
  id,
  label,
  typeInput,
  labelClassname,
  inputClassname,
  onChange,
  value,
}) => {
  return (
    <>
      <div className={formItemClassName}>
        <label htmlFor={id} className={labelClassname}>
          {label}
        </label>
        <input
          type={typeInput}
          id={id}
          className={inputClassname}
          onChange={onChange}
          // Aseguramos que el valor sea una cadena vacía si no está definido
          value={value ?? ""}
        />
      </div>
    </>
  );
};

export default FormItem;
