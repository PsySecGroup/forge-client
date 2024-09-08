import { createSignal } from "solid-js";

interface Props extends ParentProps {
  id: string
  type: 'text'
  placeholder?: string
  disabled?: boolean
  value: string
  inputStyle?: CSSModuleClasses
  style?: CSSModuleClasses
  label?: string
  onChange?: () => void
  attributes?: { [key: string]: string | boolean }
  error?: string
  helperText?: string
}

export default function TextInput(props: Props) {
  // Local state to manage the input value
  const [value, setValue] = createSignal(props.value || "");

  const handleInputChange = (e) => {
    setValue(e.target.value);
    if (props.onChange) {
      props.onChange(e.target.value);
    }
  };

  return (
    <div style={{ marginBottom: "1rem", ...props.style }}>
      {props.label && <label for={props.id || "text-input"}>{props.label}</label>}
      <input
        id={props.id || "text-input"}
        type={props.type || "text"}
        value={value()}
        onInput={handleInputChange}
        placeholder={props.placeholder || ""}
        disabled={props.disabled || false}
        style={{
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "100%",
          boxSizing: "border-box",
          ...props.inputStyle,
        }}
        {...props.attributes} // Spread additional input props
      />
      {props.error && <p style={{ color: "red", marginTop: "0.25rem" }}>{props.error}</p>}
      {props.helperText && <p style={{ marginTop: "0.25rem" }}>{props.helperText}</p>}
    </div>
  );
}
