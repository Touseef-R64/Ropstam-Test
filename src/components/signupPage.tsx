import React, { useState } from "react";
import "../styles/signup.css";
import FormInput from "./formInput";
function SignupPage() {
  const [formdata, setFormdata] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handlechange = (event) => {
    const { value, name } = event.target;
    if (name === "name") {
      let first = value.split(" ")[0];
      let second = value.split(" ")[1];
      setFormdata((prev) => ({
        ...prev,
        ["firstName"]: first,
        ["lastName"]: second,
      }));
    } else setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="BlockWrapper">
      <h2>Sign Up</h2>
      <form>
        <FormInput
          name={"name"}
          handleChange={handlechange}
          title="Full Name"
          type="text"
          required={true}
        />
        <FormInput
          name={"email"}
          handleChange={handlechange}
          title="e-mail"
          type="email"
          required={true}
        />
        <FormInput
          name={"password"}
          handleChange={handlechange}
          title="Password"
          Value={formdata?.password}
          type="password"
          required={true}
        />
        <FormInput
          name={"confirm_password"}
          handleChange={handlechange}
          title="Confirm Password"
          Value={formdata?.confirm_password}
          type="password"
          required={true}
        />
        <div className="formbtnWrapper">
          <button className="postbtn">Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;
