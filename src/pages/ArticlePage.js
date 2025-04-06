import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ArticlePage.scss";
import yellow from "./exclamation-circle.svg";

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://blog-platform.kata.academy/api/articles/${slug}`,
        );
        setArticle(response.data.article);
      } catch (err) {
        setError("Ошибка при загрузке статьи");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://blog-platform.kata.academy/api/user", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((res) => setUser(res.data.user))
        .catch((err) => {
          console.error("Ошибка при получении пользователя", err);
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  const handleCreateArticleClick = () => {
    navigate("/create-article");
  };

  const handleEditProfileClick = () => {
    navigate("/profile");
  };

  const handleLogOutClick = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleSignUpClick = () => {
    navigate("/sign-up");
  };

  const handleSignInClick = () => {
    navigate("/sign-in");
  };

  const handleEditClick = () => {
    navigate(`/edit-article/${slug}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      navigate("/");
    } catch (error) {
      console.error("Ошибка при удалении статьи", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!article) return <p>Статья не найдена</p>;

  return (
    <div className="article-page">
      <div className="header">
        <h1>Realworld Blog</h1>
        <div className="header-buttons">
          {user ? (
            <>
              <button
                className="header-create-article"
                onClick={handleCreateArticleClick}
              >
                Create Article
              </button>
              <div onClick={handleEditProfileClick} className="profile-info">
                <span className="profile-username">{user.username}</span>
                <img
                  src={user.image || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="profile-image"
                />
              </div>
              <button className="header-log-out" onClick={handleLogOutClick}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button className="header-sign-in" onClick={handleSignInClick}>
                Sign In
              </button>
              <button className="header-sign-up" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      <div className="article">
        <div className="article-card-wrapper">
          <div className="article-card-text">
            <h2>{article.title}</h2>
            <p>
              {Array.isArray(article.tagList) && article.tagList.length > 0 ? (
                article.tagList.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    {index < article.tagList.length - 1 && ", "}
                  </span>
                ))
              ) : (
                <span>Нет тегов</span>
              )}
            </p>
            <p>{article.description}</p>
            <p>{article.body}</p>
          </div>
          <div className="article-card-author">
            <p className="article-card-author-username">
              {article.author.username}
            </p>
            <p className="article-card-author-created">
              {formatDate(article.createdAt)}
            </p>

            {user && user.username === article.author.username && (
              <div className="article-card-author-buttons">
                <button
                  className="article-card-author-buttons-delete"
                  onClick={handleDeleteClick}
                >
                  Delete
                </button>
                <button
                  className="article-card-author-buttons-edit"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <img
            className="article-card-author-image"
            src={article.author.image}
            alt="Author"
          />
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <p>
            {" "}
            <img className="delete-confirm-modal-image" src={yellow} alt="" />
            Are you sure to delete this article?
          </p>
          <div className="delete-confirm-buttons">
            <button onClick={handleCancelDelete}>No</button>
            <button onClick={handleConfirmDelete}>Yes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlePage;
