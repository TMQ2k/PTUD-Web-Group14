import { twMerge } from "tailwind-merge";

const InputField = ({
  label,
  id,
  error,
  children,
  className = "",
  note = "",
  noteClassName = "",
}) => (
  <div className={twMerge("flex flex-col gap-1.5 w-full", className)}>
    <label
      htmlFor={id}
      className="text-base font-semibold bg-linear-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text"
    >
      {label + " "}
      <span className={twMerge("text-sm text-red-500 ", noteClassName)}>
        {note}
      </span>
    </label>
    {children}
    {/* Display Error Message if it exists */}
    {error && (
      <span className="text-xs text-red-500 font-medium">{error.message}</span>
    )}
  </div>
);

export default InputField;
