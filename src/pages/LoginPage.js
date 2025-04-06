// src/pages/SignInPage.js
import React, { useState } from "react";
import "./SingUp.scss";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(emailRegex)) {
      newErrors.email = "Invalid email";
    }

    if (formData.password.length < 6 || formData.password.length > 40) {
      newErrors.password = "Password must be 6-40 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(
        "https://blog-platform.kata.academy/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: {
              email: formData.email,
              password: formData.password,
            },
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.user.token);
        navigate("/"); // Перенаправляем на главную
      } else {
        setApiError(
          data.errors?.["email or password"]?.join(" ") || "Login failed",
        );
      }
    } catch (err) {
      setApiError("Something went wrong");
    }
  };

  return (
    <div className="registration">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div className="registration-email">
          <p>Email address</p>
          <input
            type="email"
            placeholder="  Email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="registration-password">
          <p>Password</p>
          <input
            type="password"
            placeholder="  Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        {apiError && <p className="error">{apiError}</p>}
      </form>
      <button className="submit" type="submit" onClick={handleSubmit}>
        Sign In
      </button>
      <p>
        Don’t have an account? <Link to="/sign-up">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
