import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./changepasswordpage.css";

function ChangePasswordPage() {
    const navigate = useNavigate();
    let [firstinput, changenameinput] = useState("");
    let [secondinput, changepasswordinput] = useState("");
    let [loading, setLoading] = useState(false);
    let [linkValid, setLinkValid] = useState(null);
    useEffect(() => {
        if(linkValid === 1) {
           navigate("/notvalid");
        }
    }, [linkValid]);
    
    useEffect(() => {
    async function checkLink() {
       
        let res = await fetch("http://localhost:5000/fetchlinkstatus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tokenHesh: new URLSearchParams(window.location.search).get("token")
            })
        })
        let jsonres = await res.json();
        setLinkValid(jsonres.isValid);
         await fetch("http://localhost:5000/changeLinkStatus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tokenHesh: new URLSearchParams(window.location.search).get("token")
            })
        })
        }
        checkLink();
    }, []);
   
    async function func1() {
        if (loading) return;

        if (firstinput.length < 6) {
            toast.warning("Password must be more than 6 characters", {
                toastId: "password-length"
            });
            return;
        }

        if (firstinput !== secondinput) {
            toast.error("Passwords do not match", {
                toastId: "password-match"
            });
            return;
        }

        setLoading(true);

        try {
            let response = await fetch("http://localhost:5000/changepassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: new URLSearchParams(window.location.search).get("token"),
                    newpassword: firstinput
                })
            });

            if (!response.ok) {
                toast.error("Password reset link is invalid or expired", {
                    toastId: "password-error"
                });
                return;
            }

            toast.success("Password changed successfully", {
                toastId: "password-success"
            });
        } catch (err) {
            toast.error("Something went wrong", {
                toastId: "network-error"
            });
        }

        setLoading(false);
    }

   return (
    <>
            <div className="change-container">
                <div className="change-card">
                    <h1>Reset Password</h1>

                    <input
                        value={firstinput}
                        onChange={(e) => changenameinput(e.target.value)}
                        type="password"
                        placeholder="New Password"
                    />

                    <input
                        value={secondinput}
                        onChange={(e) => changepasswordinput(e.target.value)}
                        type="password"
                        placeholder="Confirm Password"
                    />

                    <button onClick={func1} disabled={loading}>
                        {loading ? "Changing..." : "Change Password"}
                    </button>
                    <button onClick={() => navigate("/login")} className="back-button">
                        Back to Login
                    </button>
                </div>

                <ToastContainer
                    position="top-center"
                    autoClose={2500}
                    theme="dark"
                    limit={3}
                />
            </div>
       
    </>
);
}

export default ChangePasswordPage;