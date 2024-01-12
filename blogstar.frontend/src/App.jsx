import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Blog from './Blog.form.jsx';
import CreateBlogPage from './CreateBlogPage.jsx';
import EditBlogPage from './EditBlogPage.jsx';
import Login from './Login.form.jsx';
import Register from './Register.form.jsx';
import Header from './Header.jsx';
import CreateArticle from './CreateArticle.jsx';
import BlogArticles from './BlogArticles.jsx'
import Article from './Article.jsx'
import AllArticles from "./AllArticles.jsx";
import FavoriteArticles from './components/FavoriteArticles.jsx';
import EditArticle from './EditArticle.jsx';
import Profile from './Profile.jsx';


const App = () => {

    //localStorage.clear();
    const data = localStorage.getItem('jwtToken');

    return (
        <Router>
            <Header></Header>
            {data ?
                <Routes>
                    
                    <Route path="/create" element={<CreateBlogPage />} />
                    <Route path="/all-articles" element={<AllArticles />} />
                    <Route path="/fav" element={<FavoriteArticles />} />
                    <Route path="/create-article/:blogId" element={<CreateArticle></CreateArticle>}></Route>
                    <Route path="/edit" element={<EditBlogPage />} />
                    <Route path="/" element={<Blog />} />
                    <Route path="/articles/:blogId" element={<BlogArticles />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/article/:articleId" element={<Article />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/edit-article/:id" element={<EditArticle />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                :
                <Routes>
                   < Route path="/register" element={<Register />} />
                    <Route path="/" element={<Login />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            }
         
        </Router>
    );
};

export default App;