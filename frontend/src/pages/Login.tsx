import { useState } from "react";
import api from "../services/api";

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password || (isRegistering && !name)) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (isRegistering) {
        // Registration Logic
        await api.post("/auth/register", {
          name,
          email,
          password,
        });
        alert("Registration Successful! Please login.");
        setIsRegistering(false); // Switch to login view automatically
        setName("");
      } else {
        // Login Logic
        const response = await api.post("/auth/login", {
          email,
          password,
        });

        localStorage.setItem(
          "token",
          response.data.access_token
        );

        alert("Login Successful");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      alert(isRegistering ? "Registration Failed" : "Login Failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>⚡ CodeForge AI</h1>

        <p style={styles.subtitle}>
          {isRegistering ? "Create your workspace account" : "Build, Manage & Deploy AI Projects"}
        </p>

        {isRegistering && (
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        )}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleSubmit}
          style={styles.button}
        >
          {isRegistering ? "Register" : "Login"}
        </button>

        <p style={styles.toggleText}>
          {isRegistering ? "Already have an account? " : "Don't have an account? "}
          <span 
            onClick={() => setIsRegistering(!isRegistering)} 
            style={styles.toggleLink}
          >
            {isRegistering ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "400px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },

  logo: {
    color: "white",
    textAlign: "center" as const,
    margin: 0,
  },

  subtitle: {
    color: "#cbd5e1",
    textAlign: "center" as const,
    marginTop: "-10px",
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    fontSize: "16px",
    outline: "none",
  },

  button: {
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(90deg,#3b82f6,#06b6d4)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold" as const,
    cursor: "pointer",
  },

  toggleText: {
    color: "#cbd5e1",
    textAlign: "center" as const,
    fontSize: "14px",
    marginTop: "5px",
  },

  toggleLink: {
    color: "#3b82f6",
    fontWeight: "bold" as const,
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;