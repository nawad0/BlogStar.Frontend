import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './blog.css';

const Blog = () => {
    const [userBlogs, setUserBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [jwtToken, setJwtToken] = useState('');
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            setJwtToken(storedToken);
        }

        const fetchBlogs = async () => {
            try {
                const response = await fetch('/api/Blogs');
                if (!response.ok) {
                    throw new Error(`Не удалось получить блоги - ${response.statusText}`);
                }
                const data = await response.json();
                setBlogs(data);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при получении блогов:', error.message);
                setLoading(false);
            }
        };

        const fetchUserBlogs = async () => {
            try {
                const response = await fetch('api/Blogs/user-blogs', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Не удалось получить блоги пользователя - ${response.statusText}`);
                }
                const data = await response.json();
                setUserBlogs(data);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при получении блогов пользователя:', error.message);
                setLoading(false);
            }
        };

        fetchBlogs();
        fetchUserBlogs();
    }, []); // Пустой массив зависимостей гарантирует, что эффект выполняется только при монтировании компонента.


    // Функция для обработки клика по кнопке "Fetch Blog"
    const fetchBlog = async (blogId) => {
        try {
            const response = await fetch(`/api/Blogs/${blogId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch blog - ${response.statusText}`);
            }
            const data = await response.json();
            console.log( data);
            // Перенаправление на страницу редактирования блога с передачей данных через параметры маршрута
            localStorage.setItem('blogid', data.blogId);
            window.location.href = 'edit';
        } catch (error) {
            console.error('Error fetching blog:', error.message);
        }
    };
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/Blogs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            
            if (response.ok) {
                console.log('Blog deleted successfully');
                window.location.reload();

                // Perform additional actions if needed
            } else {
                console.error('Error deleting blog:', response.status, response.statusText);
                // Handle error, display a message to the user, etc.
            }
        } catch (error) {
            console.error('Error deleting blog:', error.message);
            // Handle network error or other exceptions
        }
    };

       
    


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-blogs-container">
            <h2 className="blogs-title">User Blogs</h2>
            <ul className="blog-list">
                {userBlogs.map((blog) => (
                    <li key={blog.blogId} className="blog-item">
                        <div className="blog-details">
                            <div className="blog-author">{blog.userName}</div>
                            <Link to={`/create-article/${blog.blogId}`} className="blog-title">
                                {blog.title}
                            </Link>
                            <div className="blog-description">{blog.description}</div>
                            <div className="blog-meta">
                                <strong></strong> {blog.creationDate}
                            </div>
                            <div className="blog-actions">
                                <button className="read-button" onClick={() => fetchBlog(blog.blogId)}>
                                    Read
                                </button>
                                <button className="delete-button" onClick={() => handleDelete(blog.blogId)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );



   

};

export default Blog;
   

