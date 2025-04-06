import React from "react";
import { Link } from "react-router-dom";
import "./ArticleCard.scss";
import Vector from "./Vector.svg";

const ArticleCard = ({ article }) => {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  return (
    <div className="article-card">
      <div className="article-card-wrapper">
        <div className="article-card-text">
          <div className="article-slugcount">
            <h2>
              <Link to={`/articles/${article.slug}`}>{article.title}</Link>
            </h2>
            <img src={Vector} alt="" />
            <p className="article-slugcount-likes">{article.favoritesCount}</p>
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
