import { TransitionGroup, CSSTransition } from 'react-transition-group';


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import './blog.css';
import CreateBlogPage from './CreateBlogPage';
import MyModal from './components/UI/MyModal/MyModal';
import EditBlogPage from './EditBlogPage';

const Blog = () => {
    const [userBlogs, setUserBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jwtToken, setJwtToken] = useState('');
    const [modalCreate, setModalCreate] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [currentBlogId, setCurrentBlogId] = useState(null);

    // Fade-in animation for the blog container
    const fadeIn = useSpring({
        opacity: loading ? 0 : 1,
        from: { opacity: 0 },
    });

    // Fetch user blogs on component mount and when modalCreate or userBlogs change
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');

        if (storedToken) {
            setJwtToken(storedToken);
        }

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

        fetchUserBlogs();
    }, [modalCreate, userBlogs]);

    // Delete blog entry
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
                setUserBlogs(userBlogs.filter((p) => p.blogId !== id));
            } else {
                console.error('Error deleting blog:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error deleting blog:', error.message);
        }
    };

    // Create or edit blog
    const handleEditClick = (blogId) => {
        setCurrentBlogId(blogId);
        setModalEdit(true);
    };

    const createBlog = () => {
        setModalCreate(false);
        setModalEdit(false);
    };
    const getPlaceholderImageUrl = () => {
        const width = 100; // Adjust the width of the image
        const height = 100; // Adjust the height of the image
        return `https://via.placeholder.com/${width}x${height}`;
    };

    return (
        <animated.div style={fadeIn} className="blog-container">
            <header className="blog-header">
                <div className="logo">wooow let go</div>
                <button className="create-post-btn" onClick={() => setModalCreate(true)}>
                    Create a Post
                </button>
            </header>

            <div className="blog-list">
                {userBlogs.map((blog) => (
                    <div key={blog.blogId} className="blog-item">
                        <Link to={`/articles/${blog.blogId}`} style={{ textDecoration: 'none' }}>
                            <div className="blog-content">
                                {/* Placeholder image from Placeholder.com with dimensions 100x100 */}
                                <div className="blog-thumbnail">
                                    <img
                                        src={`https://via.placeholder.com/150x150`}  // Set dimensions to 100x100
                                        alt="Blog Thumbnail"
                                        className="thumbnail-image"
                                    />
                                </div>
                                <div className="blog-details">
                                    <h3 className="author">{blog.userName}</h3>
                                    <h1 className="blog-title">{blog.title}</h1>
                                    <p className="blog-description">{blog.description}</p>
                                    <p className="blog-date">{blog.creationDate}</p>
                                </div>
                            </div>
                        </Link>

                        <div className="blog-buttons">
                            <button className="edit-btn" onClick={() => handleEditClick(blog.blogId)}>
                                Edit
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(blog.blogId)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <MyModal visible={modalCreate} setVisible={setModalCreate}>
                <CreateBlogPage create={createBlog} />
            </MyModal>

            {currentBlogId !== null && (
                <MyModal visible={modalEdit} setVisible={setModalEdit}>
                    <EditBlogPage id={currentBlogId} create={createBlog} />
                </MyModal>
            )}
        </animated.div>
    );




};

export default Blog;