import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./forgot.css";

function Forgot() {
    const [emailinput, changeemailinput] = useState("");
    const [loading, setLoading] = useState(false);
    async function func1() {
        if (loading) return; 

        if (!emailinput) {
            toast.warning("Enter an email", { toastId: "empty-email" });
            return;
        }

        setLoading(true);

        try {
            await fetch("https://multipurposeproject.onrender.com/forgotpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: emailinput })
            });

            toast.success(
                "If an account exists, a reset link has been sent",
                { toastId: "email-sent" }
            );
        } catch (err) {
            toast.error("Something went wrong", { toastId: "error" });
        }

        setLoading(false);
    }

    return (
        <div className="forgot-container">
            <div className="forgot-card">
                <h1>Forgot password?</h1>
                <p>Enter your email and we’ll send you a reset link.</p>

                <input
                    value={emailinput}
                    onChange={(e) => changeemailinput(e.target.value)}
                    type="email"
                    placeholder="Email"
                />

                <button onClick={func1} disabled={loading}>
                    {loading ? "Sending..." : "Submit"}
                </button>
            </div>

            <ToastContainer
                position="top-center"
                autoClose={2500}
                theme="dark"
                limit={1} // only 1 visible
            />
        </div>
    );
}

export default Forgot;