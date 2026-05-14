import { useNavigate } from "react-router-dom";
import "./emailverified.css";
function Verification() {
    const navigate = useNavigate();
  return (
    <div className="verified-page">
      <div className="verified-glow verified-glow-1"></div>
      <div className="verified-glow verified-glow-2"></div>

      <div className="verified-card">
        <div className="verified-icon-wrap">
          <div className="verified-icon">✓</div>
        </div>

        <h1>Email verified</h1>

        <p>
          Your account has been successfully verified. You can now continue to
          the login page and access your account.
        </p>

        <button onClick={() => navigate("/login")}>Go to login</button>
      </div>
    </div>
  );
}
export default Verification;