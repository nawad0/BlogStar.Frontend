import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton, Typography } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import { Link } from 'react-router-dom';


const ProfileBlog = () => {
    const [userBlogs, setUserBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fade-in animation for the blog container
    const fadeIn = useSpring({
        opacity: loading ? 0 : 1,
        from: { opacity: 0 },
    });

    // Fetch user blogs on component mount
    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                const storedToken = localStorage.getItem('jwtToken');
                const response = await axios.get('api/Blogs/user-blogs', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setUserBlogs(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user blogs:', error.message);
                setLoading(false);
            }
        };

        fetchUserBlogs();
    }, []);

    return (
        <animated.div style={fadeIn} >
            <div>
                {userBlogs.map((blog) => (
                    <Card key={blog.blogId} sx={{ width: 700}}>
                        <CardHeader
                            avatar={<Avatar aria-label="recipe">{blog.userName[0]}</Avatar>}
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
                            <Link to={`/articles/${blog.blogId}`} style={{ marginLeft: 'auto' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Перейти к статьям блога
                                </Typography>
                            </Link>
                        </CardActions>
                    </Card>
                ))}
            </div>
        </animated.div>
    );
};

export default ProfileBlog;
