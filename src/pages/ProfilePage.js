// src/pages/EditProfile.js
import React, { useState, useEffect } from "react";
import "./SingUp.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    axios
      .get("https://blog-platform.kata.academy/api/user", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        const { username, email, image } = res.data.user;
        setFormData((prev) => ({
          ...prev,
          username,
          email,
          image: image || "",
        }));
      })
      .catch(() => {
        setApiError("Не удалось загрузить профиль");
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.put(
        "https://blog-platform.kata.academy/api/user",
        { user: formData },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      navigate("/");
    } catch (err) {
      setApiError("Ошибка при обновлении профиля");
    }
  };

  return (
    <div className="registration">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="registration-username">
          <p>Username</p>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="registration-email">
          <p>Email address</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="registration-password">
          <p>New Password</p>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />
        </div>
        <div className="registration-password">
          <p>Avatar image URL</p>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
          />
        </div>

        {apiError && <p className="error">{apiError}</p>}

        <button className="submit" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
