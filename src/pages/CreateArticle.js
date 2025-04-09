import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArticleForm from "./ArticleForm";

const CreateArticle = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://blog-platform.kata.academy/api/articles",
        { article: formData },
        { headers: { Authorization: `Token ${token}` } },
      );
      navigate(`/articles/${response.data.article.slug}`);
    } catch (error) {
      console.error("Ошибка при создании статьи", error);
    }
  };

  return <ArticleForm onSubmit={handleSubmit} />;
};

export default CreateArticle;
