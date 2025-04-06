// src/pages/EditArticlePage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditArticlePage.scss";

const EditArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagList, setTagList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    axios
      .get(`https://blog-platform.kata.academy/api/articles/${slug}`)
      .then((res) => {
        const article = res.data.article;
        setTitle(article.title);
        setDescription(article.description);
        setBody(article.body);
        setTagList(article.tagList || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Ошибка при загрузке статьи");
        setLoading(false);
      });
  }, [slug, navigate]);

  const handleTagAdd = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tagList.includes(trimmedTag)) {
      setTagList([...tagList, trimmedTag]);
      setTagInput("");
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTagList(tagList.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          article: {
            title,
            description,
            body,
            tagList,
          },
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      navigate(`/articles/${slug}`);
    } catch (err) {
      setError("Ошибка при обновлении статьи");
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="create-article-wrapper">
      <form className="create-article-form" onSubmit={handleSubmit}>
        <h2 className="create-article-title">Edit article</h2>

        <label className="create-article-label">
          Title
          <input
            className="create-article-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="create-article-label">
          Short description
          <input
            className="create-article-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label className="create-article-label">
          Text
          <textarea
            className="create-article-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </label>

        <label className="create-article-label">
          Tags
          <div className="create-article-tags">
            <input
              className="create-article-tag-input"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <button
              className="create-article-add-tag"
              type="button"
              onClick={handleTagAdd}
            >
              Add tag
            </button>
          </div>
        </label>

        <div className="create-article-tag-list">
          {tagList.map((tag, index) => (
            <div key={index} className="create-article-tag-item">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleTagDelete(tag)}
                className="create-article-delete-tag"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <button className="create-article-submit" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditArticlePage;
