import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ArticleCard.scss";
import Vector from "./Vector.svg";
import VectorLiked from "./Heart_corazón 1.svg";

const ArticleCard = ({ article }) => {
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  const [favorited, setFavorited] = useState(article.favorited);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  const handleLikeClick = async () => {
    if (!token) return; // Только для авторизованных пользователей

    try {
      if (favorited) {
        await axios.delete(
          `https://blog-platform.kata.academy/api/articles/${article.slug}/favorite`,
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        setFavoritesCount((prev) => prev - 1);
      } else {
        await axios.post(
          `https://blog-platform.kata.academy/api/articles/${article.slug}/favorite`,
          {},
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        setFavoritesCount((prev) => prev + 1);
      }
      setFavorited(!favorited);
    } catch (error) {
      console.error("Ошибка при попытке лайкнуть статью:", error);
    }
  };

  return (
    <div className="article-card">
      <div className="article-card-wrapper">
        <div className="article-card-text">
          <div className="article-slugcount">
            <h2>
              <Link to={`/articles/${article.slug}`}>{article.title}</Link>
            </h2>
            <img
              src={favorited ? VectorLiked : Vector}
              alt="Like"
              className={`like-icon ${favorited ? "liked" : ""}`}
              onClick={handleLikeClick}
              style={{ cursor: token ? "pointer" : "default" }}
            />
            <p className="article-slugcount-likes">{favoritesCount}</p>
          </div>

          <p>
            {Array.isArray(article.tagList) && article.tagList.length > 0 ? (
              article.tagList.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  {index < article.tagList.length - 1 && " "}
                </span>
              ))
            ) : (
              <span>Нет тегов</span>
            )}
          </p>

          <p>{article.description}</p>
        </div>

        <div className="article-card-author">
          <p className="article-card-author-username">
            {article.author.username}
          </p>
          <p className="article-card-author-created">
            {formatDate(article.createdAt)}
          </p>
        </div>

        <img
          className="article-card-author-image"
          src={article.author.image}
          alt=""
        />
      </div>
    </div>
  );
};

export default ArticleCard;
