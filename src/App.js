import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import SingUp from "./pages/SingUp";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import CreateArticle from "./pages/CreateArticle";
import EditArticlePage from "./pages/EditArticlePage";

const App = () => {
  return (
    <Provider store={store}>
      {" "}
      {/* Оборачиваем все приложение в Provider */}
      <Router>
        <Routes>
          <Route path="/" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/sign-up" element={<SingUp />} />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-article" element={<CreateArticle />} />
          <Route path="/edit-article/:slug" element={<EditArticlePage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
