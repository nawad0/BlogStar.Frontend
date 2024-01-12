import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import './blog.css';
import CreateBlogPage from './CreateBlogPage';
import MyModal from './components/UI/MyModal/MyModal';
import EditBlogPage from './EditBlogPage';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
                <div className="logo">My Blog</div>
                <button className="create-post-btn" onClick={() => setModalCreate(true)}>Create a Post</button>
            </header>

            <div className="blog-list">
                {userBlogs.map((blog) => (
                    <Card key={blog.blogId} sx={{ marginBottom: 2 }}>
                        <CardHeader
                            avatar={<Avatar src={`${blog.authorImagePath}`} aria-label="author"> </Avatar>}
                            title={blog.title}
                            subheader={blog.creationDate}
                        />

                        <CardMedia
                            component="img"
                            height="194"
                            image={blog.image ? blog.image : getPlaceholderImageUrl()}
                            alt="Blog Thumbnail"
                        />
                        
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {blog.description}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            {/*<IconButton aria-label="add to favorites">*/}
                            {/*    <FavoriteIcon />*/}
                            {/*</IconButton>*/}
                            {/*<IconButton aria-label="share">*/}
                            {/*    <ShareIcon />*/}
                            {/*</IconButton>*/}
                            <IconButton aria-label="edit" onClick={() => handleEditClick(blog.blogId)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => handleDelete(blog.blogId)}>
                                <DeleteIcon />
                            </IconButton>
                            <Link to={`/articles/${blog.blogId}`} style={{ marginLeft: 'auto' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Перейти к статьям блога
                                </Typography>
                            </Link>
                        </CardActions>
                    </Card>
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