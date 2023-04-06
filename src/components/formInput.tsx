import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../styles/signup.css";

interface props {
  Value?: string;
  handleChange: (event) => void;
  name: string;
  title: string;
  type: string;
  valid?: any;
  required?: boolean;
}

const FormInput = ({
  Value,
  handleChange,
  valid,
  name,
  title,
  type,
  required,
}: props) => {
  const [focus, setFocus] = useState([]);
  const [ispass, setispass] = useState(true);

  return (
    <>
      <div className={`formGroup`}>
        <label
          className={`${
            focus.includes(name) || (Value && Value != "") ? "active" : ""
          }`}
        >
          {title}
          {required && <span className={"requiredLabel"}> *</span>}
        </label>

        <div className={type === "password" ? `inputBox` : ""}>
          <input
            onFocus={() => {
              setFocus((prevArray) => [...prevArray, name]);
            }}
            onBlur={(event) => {
              if (event.target.value.length < 1)
                setFocus((current) => current.filter((prev) => prev !== name));
            }}
            onChange={(event) => {
              handleChange(event);
            }}
            type={type !== "password" ? type : ispass ? type : "text"}
            name={name}
            value={Value && (Value || "")}
            required={required ? true : false}
          ></input>

          {type === "password" && (
            <span
              className={"hidepass"}
              onClick={() => {
                setispass(!ispass);
              }}
            >
              <FontAwesomeIcon icon={ispass ? faEyeSlash : faEye} />
            </span>
          )}
        </div>
      </div>
      {valid && valid.find((it) => it?.name === name)?.haserror && (
        <p className={"errorMessage"}>
          {valid.find((it) => it?.name === name)?.message}
        </p>
      )}
    </>
  );
};

export default FormInput;
