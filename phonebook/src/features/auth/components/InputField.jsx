import React from "react";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  error,
}) => {
  return (
    <div
      className={`input-wrapper ${
        value ? "filled" : ""
      } ${error ? "has-error" : ""}`}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <label>{label}</label>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default InputField;