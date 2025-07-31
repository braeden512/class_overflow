import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../App.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the data payload
    const userData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      // Call the login API or your logic here
      // fetch the path where PHP server is running
      const response = await fetch("http://localhost/class_overflow/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Login successful");

        // Store whether a user is logged in or not
        localStorage.setItem("isLoggedIn", "true");

        // Store the user's information as a JSON, including the school_id
        localStorage.setItem("user", JSON.stringify({
          id: result.user.id,
          username: result.user.username,
          school: result.user.school,  // Saving school name here
          school_id: result.user.school_id,
          dark_mode: result.user.dark_mode
        }));

        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.dark_mode === 1) {
          document.body.classList.add("dark-mode");
        }
        else {
          document.body.classList.remove("dark-mode");
        }

        navigate("/home");
      } else {
        if (result.error === "User not found.") {
          alert("You need to register your account first before logging in.");
        } else {
          alert(result.error || "Login failed.");
        }
      }
    } catch (error) {
      console.error("There was an error during login", error);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="page-content">
      <div className="container">
        <h2 className="title">Login</h2>
        {error && <p className="message" style={{ color: "red" }}>{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="label">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="label">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <button type="submit" className="button">Login</button>
        </form>
        <p className="linkText">
          Don't have an account? <Link to="/register" className="link">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
