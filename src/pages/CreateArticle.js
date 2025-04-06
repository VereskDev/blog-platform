// src/pages/CreateArticle.js
import React, { useState } from "react";
import "./SingUp.scss";
import "./CreateArticle.scss";
import { useNavigate } from "react-router-dom";

const CreateArticle = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    body: "",
    tag: "",
    tags: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    const trimmedTag = formData.tag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
        tag: "",
      }));
    }
  };

  const deleteTag = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await fetch(
        "https://blog-platform.kata.academy/api/articles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            article: {
              title: formData.title,
              description: formData.description,
              body: formData.body,
              tagList: formData.tags,
            },
          }),
        },
      );

      if (res.ok) {
        navigate("/");
      } else {
        console.error("Failed to create article");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="registration">
      <h1>Create Article</h1>
      <form onSubmit={handleSubmit}>
        <div className="registration-email">
          <p>Title</p>
          <input
            type="text"
            name="title"
            placeholder="  Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="registration-email">
          <p>Short description</p>
          <input
            type="text"
            name="description"
            placeholder="  Short description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="registration-password">
          <p>Text</p>
          <textarea
            className="text"
            name="body"
            placeholder="  Text"
            value={formData.body}
            onChange={handleChange}
            rows="6"
            required
          />
        </div>
        <div className="registration-email">
          <p>Tags</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              name="tag"
              placeholder="  Tag"
              value={formData.tag}
              onChange={handleChange}
            />
            <button type="button" className="button-add" onClick={addTag}>
              Add
            </button>
          </div>
          <div style={{ marginTop: "10px" }}>
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "5px",
                }}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  className="button-delete"
                  onClick={() => deleteTag(tag)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
        <button className="submit" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default CreateArticle;
