import React, { useState, useEffect } from "react";
import "./SingUp.scss";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../services/myApi";

const SignUp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    agreed: false,
  });

  const [errors, setErrors] = useState({});
  const [registerUser, { isLoading, isError, error }] = useRegisterMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(emailRegex)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = "Username must be between 3 and 20";
    }

    if (formData.password.length < 6 || formData.password.length > 40) {
      newErrors.password = "Your password needs to be at least 6 characters";
    }

    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Passwords must match";
    }

    if (!formData.agreed) {
      newErrors.agreed = "You must agree to the processing of personal data";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const userData = {
          user: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          },
        };

        const response = await registerUser(userData).unwrap();
        const { token } = response;

        localStorage.setItem("token", token);
        navigate("/");
      } catch (error) {
        console.error("Registration failed:", error);
        setErrors({ submit: error.message || "Something went wrong" });
      }
    }
  };

  return (
    <div className="registration">
      <h1>Create new account</h1>
      <form onSubmit={handleSubmit}>
        <div className="registration-username">
          <p>Username</p>
          <input
            type="text"
            placeholder="  Username"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className="registration-email">
          <p>Email address</p>
          <input
            type="email"
            placeholder="  Email address"
            id="email"
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
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="registration-password">
          <p>Repeat Password</p>
          <input
            type="password"
            placeholder="  Repeat Password"
            id="repeatpassword"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            required
          />
          {errors.repeatPassword && (
            <p className="error">{errors.repeatPassword}</p>
          )}
        </div>

        <input
          className={`checkbox ${errors.agreed ? "checkbox-error" : ""}`}
          type="checkbox"
          name="agreed"
          checked={formData.agreed}
          onChange={handleChange}
        />
        <label className="checkbox-label" htmlFor="checkbox">
          I agree to the processing of my personal <span>information</span>
        </label>
        {errors.agreed && <p className="error">{errors.agreed}</p>}
      </form>
      <button
        className="submit"
        type="submit"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Create"}
      </button>
      <p>
        Already have an account? <Link to="/sign-in">Sign In</Link>
      </p>
      {isError && (
        <p className="error">
          {error?.data?.message || "Something went wrong"}
        </p>
      )}
    </div>
  );
};

export default SignUp;
