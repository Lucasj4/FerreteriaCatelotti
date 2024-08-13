import React from "react";

const FormItem = ({
  formItemClassName,
  id,
  label,
  typeInput,
  labelClassname,
  inputClassname,
  onChange,
  value
}) => {
  return (
    <>
      <div className={formItemClassName}>
        <label htmlFor={id} className={labelClassname}>{label}</label>
        <input
          type={typeInput}
          id={id}
          className={inputClassname}
          onChange={onChange}
          value={value}

        />
      </div>
    </>
  );
};

export default FormItem;
