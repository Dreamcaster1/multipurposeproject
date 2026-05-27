import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

function Registration() {
  const navigate = useNavigate();

  const [nameinput, changenameinput] = useState("");
  const [passwordinput, changepasswordinput] = useState("");
  const [cityinput, changecityinput] = useState("");
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  async function sendtologin() {
    let sessionResponse = await fetch("multipurposeproject-yhxq.vercel.app/checksession", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
    let sessionExists = await sessionResponse.json();
    if (sessionExists) {
      navigate("/weather");
    }
    else{
      navigate("/login");
    }
  }

  function getinputn(e) {
    const value = e.target.value;
    changenameinput(value);

    setErrors((prev) => ({
      ...prev,
      email: "",
    }));
  }

  function getinputp(e) {
    const value = e.target.value;
    changepasswordinput(value);

    setErrors((prev) => ({
      ...prev,
      password: "",
    }));
  }

  function getinputc(e) {
    const value = e.target.value;
    changecityinput(value);

    setErrors((prev) => ({
      ...prev,
      city: "",
    }));
  }

  function showToast(message, type = "error") {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  function validateFields() {
    const newErrors = {};

    if (nameinput.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(nameinput)) {
      newErrors.email = "Enter a valid email address";
    }

    if (passwordinput.trim() === "") {
      newErrors.password = "Password is required";
    } else if (passwordinput.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (cityinput.trim() === "") {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function func1() {
    const isValid = validateFields();

    if (!isValid) {
      return;
    }

    try {
      let emailCheckResponse = await fetch("https://multipurposeproject.onrender.com/checkemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailforcheck: nameinput }),
      });

      let emailExists = await emailCheckResponse.json();

      if (emailExists == false) {
        showToast("Email already exists", "error");
        return;
      }

      let registrationResponse = await fetch("multipurposeproject-yhxq.vercel.app/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nameforreg: nameinput,
          passwordforreg: passwordinput,
          cityforreg: cityinput,
        }),
      });

      if (registrationResponse.ok) {
        showToast("The verification link has been sent to your email", "success");
      } else {
        showToast("Registration failed", "error");
      }
    } catch (error) {
      console.log(error);
      showToast("Server error, try again", "error");
    }
  }

  return (
    <div className="login-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="login-card">
        <h1>Create an account</h1>

        <label>Email</label>
        <input
          className={errors.email ? "input-error" : ""}
          value={nameinput}
          onChange={getinputn}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}

        <label>Password</label>
        <input
          className={errors.password ? "input-error" : ""}
          value={passwordinput}
          onChange={getinputp}
          type="password"
        />
        {errors.password && <span className="field-error">{errors.password}</span>}

        <label>City</label>
        <input
          className={errors.city ? "input-error" : ""}
          value={cityinput}
          onChange={getinputc}
        />
        {errors.city && <span className="field-error">{errors.city}</span>}

        <button onClick={func1}>Register</button>

        <button className="text-button" onClick={sendtologin}>
  Already registered?
</button>
      </div>
    </div>
  );
}

export default Registration;