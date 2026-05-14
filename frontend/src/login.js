import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login({ setSessionRes }) {
  const navigate = useNavigate();

  const [nameinput, changenameinput] = useState("");
  const [passwordinput, changepasswordinput] = useState("");
  const [toast, setToast] = useState(null);

  function getinputn(e) {
    changenameinput(e.target.value);
  }

  function getinputp(e) {
    changepasswordinput(e.target.value);
  }

  function showToast(message, type = "error") {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  async function func1() {
    try {
      let response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nameforlog: nameinput,
          passwordforlog: passwordinput,
        }),
      });

      let responsebool = await response.json();
      console.log(responsebool);

      if (responsebool === true) {
        setSessionRes(true);
        navigate("/weather");
      } else {
        setSessionRes(false);
        showToast("Invalid email or password", "error");
      }
    } catch (error) {
      console.log(error);
      showToast("Server error, try again", "error");
    }
  }

  function forgotpass() {
    navigate("/forgot");
  }

  return (
    <div className="login-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="login-card">
        <h1>Welcome back</h1>

        <label>Email</label>
        <input value={nameinput} onChange={getinputn} />

        <label>Password</label>
        <input value={passwordinput} onChange={getinputp} type="password" />

        <button onClick={func1}>Login</button>

        <button className="text-button" onClick={forgotpass}>
  Forgot password?
</button>
      </div>
    </div>
  );
}

export default Login;