import { createSignal } from "solid-js";

interface Props extends ParentProps {
  id: string
  label?: string
  value?: string
  onChange?: () => void
  disabled?: boolean
  style?: CSSModuleClasses
  selectStyle?: CSSModuleClasses
  placeholder?: string
  attributes?: { [key: string]: string | boolean }
  error?: string
  helperText?: string
  options: string[] | {
    label: string
    value: string
  }[]
}


export default function Select(props: Props) {
  // Local state to manage selected value(s)
  const [selectedValue, setSelectedValue] = createSignal(props.value || (props.multiple ? [] : ""));

  const handleChange = (e) => {
    const value = e.target.value;

    setSelectedValue(value);
    
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <div style={{ marginBottom: "1rem", ...props.style }}>
      {props.label && <label for={props.id || "select-input"}>{props.label}</label>}
      <select
        id={props.id || "select-input"}
        value={selectedValue()}
        onChange={handleChange}
        disabled={props.disabled || false}
        style={{
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "100%",
          boxSizing: "border-box",
          ...props.selectStyle,
        }}
        {...props.selectProps} // Spread additional select props
      >
        {props.placeholder && (
          <option value="" disabled hidden>
            {props.placeholder}
          </option>
        )}
        {props.options.map((option) =>
          typeof option === "string" ? (
            <option value={option} key={option}>
              {option}
            </option>
          ) : (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          )
        )}
      </select>
      {props.error && <p style={{ color: "red", marginTop: "0.25rem" }}>{props.error}</p>}
      {props.helperText && <p style={{ marginTop: "0.25rem" }}>{props.helperText}</p>}
    </div>
  );
}
