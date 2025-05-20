// App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container">
      {isLogin ? (
        <LoginForm switchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm switchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}

const LoginForm = ({ switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("action", "login");
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch(
        "https://script.google.com/a/macros/ssn.edu.in/s/AKfycbys8W5jUo_tOpapYdkdIS-fma3GSyKkD6iq__Zd9EXl4wEJXpJOK5hATjih6Dh17eoa/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: formData.toString(),
        }
      );

      const text = await response.text();
      const data = JSON.parse(text);

      if (data.success) {
        alert("Login successful!");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Connection error");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <p className="switch-text">
        Don't have an account?{" "}
        <button type="button" onClick={switchToRegister} className="switch-btn">
          Register
        </button>
      </p>
    </form>
  );
};

const RegisterForm = ({ switchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("action", "login");
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name);
      formData.append("confirmPassword", confirmPassword);

      const response = await fetch(
        "https://script.google.com/a/macros/ssn.edu.in/s/AKfycbys8W5jUo_tOpapYdkdIS-fma3GSyKkD6iq__Zd9EXl4wEJXpJOK5hATjih6Dh17eoa/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: formData.toString(),
        }
      );

      const text = await response.text();
      const data = JSON.parse(text);

      if (data.success) {
        alert("Login successful!");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Connection error");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      <p className="switch-text">
        Already have an account?{" "}
        <button type="button" onClick={switchToLogin} className="switch-btn">
          Login
        </button>
      </p>
    </form>
  );
};

export default App;
