import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "./ArticleCard";
import Pagination from "./Pagination";
import "./ArticlesPage.scss";
import { useNavigate, useLocation } from "react-router-dom";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null);
  const pageSize = 20;

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const setPage = (pageNum) => {
    navigate(`?page=${pageNum}`);
  };

  const fetchArticles = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://blog-platform.kata.academy/api/articles",
        {
          params: { limit: pageSize, offset: (pageNumber - 1) * pageSize },
        },
      );

      if (response.data && response.data.articles) {
        setArticles(response.data.articles);
        setTotalPages(Math.ceil(response.data.articlesCount / pageSize));
      } else {
        throw new Error("Некорректные данные от API");
      }
    } catch (err) {
      setError("Ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);

    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://blog-platform.kata.academy/api/user", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => setUser(response.data.user))
        .catch((err) => {
          console.error("Ошибка при получении данных пользователя", err);
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            setUser(null);
          }
        });
    }
  }, [currentPage]);

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

  return (
    <div>
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
                  alt=""
                  className="profile-image"
                />
              </div>
              <button className="header-log-out" onClick={handleLogOutClick}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                className="header-sign-in"
                onClick={() => navigate("/sign-in")}
              >
                Sign In
              </button>
              <button
                className="header-sign-up"
                onClick={() => navigate("/sign-up")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p>{error}</p>}

      <div className="articles-list">
        {articles.length > 0
          ? articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))
          : !loading && <p>Нет статей</p>}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ArticlesPage;
