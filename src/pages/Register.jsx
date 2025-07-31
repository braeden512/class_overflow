import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../App.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    college: "",
  });

  const [error, setError] = useState("");  // For error handling
  const navigate = useNavigate(); // For navigation after successful registration

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
      displayName: formData.displayName,
      college: formData.college,
    };
    try {
      const response = await fetch("http://localhost/class_overflow/api/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // Handle success or error based on the response from PHP server
      if (data.success) {
        console.log("User registered successfully");

        // after registering, users have to log in, because other relevant components must have information on current user logged in
        navigate("/login");

      } else {
        setError(data.error || "Error registering user");
      }
    } catch (error) {
      console.error("There was an error during registration", error);
      setError("Something went wrong. Please try again.");
    }
  };
  return (
    <>
      <div className="page-content">
        <div className="container">
          <h2 className="title">Register</h2>
          {error && <p className="message" style={{ color: "red" }}>{error}</p>}
          <form className="form" onSubmit={handleSubmit}>
            <label className="label">
              Display Name:
              <input
                type="text"
                name="displayName"
                className="input"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
            </label>
            <label className="label">
              Email:
              <input
                type="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label className="label">
              Password:
              <input
                type="password"
                name="password"
                className="input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <label className="label">
              College:
              <input
                type="text"
                name="college"
                className="input"
                value={formData.college}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit" className="button">Register</button>
          </form>
          <p className="linkText">
            Already have an account?{" "}
            <Link to="/login" className="link">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;