import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import SignUp from "./pages/SingUp";
import SignIn from "./pages/LoginPage";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticlePage";
import Profile from "./pages/ProfilePage";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://blog-platform.kata.academy/api/user", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/create-article"
          element={user ? <CreateArticle /> : <Navigate to="/" replace />}
        />
        <Route
          path="/edit-article/:slug"
          element={user ? <EditArticle /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
