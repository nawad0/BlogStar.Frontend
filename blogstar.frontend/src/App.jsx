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

const App = () => {

    //localStorage.clear();
    const data = localStorage.getItem('jwtToken');

    return (
        <Router>
            <Header></Header>
            {data ?
                <Routes>

                    <Route path="/create" element={<CreateBlogPage />} />
                    <Route path="/create-article/:blogId" element={<CreateArticle></CreateArticle>}></Route>
                    <Route path="/edit" element={<EditBlogPage />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/articles/:blogId" element={<BlogArticles />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/article/:articleId" element={<Article />} />
                    <Route path="/" element={<Register />} />
                    <Route path="*" element={<Navigate to="/blog" />} />
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