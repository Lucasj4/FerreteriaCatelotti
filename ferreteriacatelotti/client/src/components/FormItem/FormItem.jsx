import React from "react";

const FormItem = ({
  formItemClassName,
  id,
  label,
  typeInput,
  labelClassname,
  inputClassname,
  onChange
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

        />
      </div>
    </>
  );
};

export default FormItem;
