import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ArticleForm from "./ArticleForm";

const EditArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");
      try {
        const response = await axios.get(
          `https://blog-platform.kata.academy/api/articles/${slug}`,
          { headers: { Authorization: `Token ${token}` } },
        );
        setInitialValues(response.data.article);
      } catch (error) {
        console.error("Ошибка при загрузке статьи", error);
        navigate("/");
      }
    };

    fetchArticle();
  }, [slug, navigate]);

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        { article: formData },
        { headers: { Authorization: `Token ${token}` } },
      );
      navigate(`/articles/${response.data.article.slug}`);
    } catch (error) {
      console.error("Ошибка при редактировании", error);
    }
  };

  return initialValues ? (
    <ArticleForm initialValues={initialValues} onSubmit={handleSubmit} />
  ) : (
    <p>Загрузка...</p>
  );
};

export default EditArticle;
