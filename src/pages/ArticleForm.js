import React, { useState, useEffect } from "react";
import "./SingUp.scss";
import "./ArticleForm.scss";

const ArticleForm = ({ initialData = {}, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    body: "",
    tagList: [""],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        body: initialData.body || "",
        tagList: initialData.tagList || [""],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tagList];
    newTags[index] = value;
    setFormData({ ...formData, tagList: newTags });
  };

  const handleAddTag = () => {
    setFormData((prev) => ({
      ...prev,
      tagList: [...prev.tagList, ""],
    }));
  };

  const handleDeleteTag = (index) => {
    const newTags = [...formData.tagList];
    newTags.splice(index, 1);
    setFormData({ ...formData, tagList: newTags });
  };

  const validate = () => {
    let newErrors = {};

    if (formData.title.trim() === "") {
      newErrors.title = "Title is required";
    }

    if (formData.description.trim() === "") {
      newErrors.description = "Short description is required";
    }

    if (formData.body.trim() === "") {
      newErrors.body = "Text is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="registration">
      <h1>{isEdit ? "Edit article" : "Create new article"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="registration-username">
          <p>Title</p>
          <input
            type="text"
            name="title"
            placeholder="  Article title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        <div className="registration-email">
          <p>Short description</p>
          <input
            type="text"
            name="description"
            placeholder="  Short description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div className="registration-password">
          <p>Text</p>
          <textarea
            name="body"
            placeholder="  Text"
            value={formData.body}
            onChange={handleChange}
            rows={6}
          />
          {errors.body && <p className="error">{errors.body}</p>}
        </div>

        <div className="registration-password">
          <p>Tags</p>
          {formData.tagList.map((tag, index) => (
            <div key={index} style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                placeholder="  Tag"
              />
              <button type="button" onClick={() => handleDeleteTag(index)}>
                Delete
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddTag}>
            Add tag
          </button>
        </div>

        <button type="submit" className="submit">
          {isEdit ? "Save" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default ArticleForm;
