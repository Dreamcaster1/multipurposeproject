import "./notvalid.css";

function NotValid() {
    return (
        <div className="nv-container">
            <div className="nv-card">
                <h1>Invalid or expired link</h1>
                <p>This reset link is no longer valid. Try requesting a new one.</p>

                <button onClick={() => window.location.href = "/login"}>
                    Go to login
                </button>
            </div>
        </div>
    );
}

export default NotValid;