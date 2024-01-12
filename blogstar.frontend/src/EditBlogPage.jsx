import React, { useState, useEffect } from 'react';
import "./blog-edit.css"
import { TextField, Button, CircularProgress, Box, Typography } from '@mui/material';

const EditBlogPage = ({ id, create }) => {
    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        image: '', // New property for storing the base64 image data
    });

    const [loading, setLoading] = useState(true);
    const [jwtToken, setJwtToken] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            setJwtToken(storedToken);
        }

        const fetchBlog = async () => {
            try {
                const response = await fetch(`/api/Blogs/${id}`);
                const data = await response.json();

                setBlogData({
                    blogId: data.blogId,
                    creationDate: data.creationDate,
                    title: data.title,
                    description: data.description,
                    ownerUserId: data.ownerUserId,
                    userName: data.userName,
                    image: data.image || '', // Set the default image data if available
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching blog:', error.message);
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogData({ ...blogData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBlogData({ ...blogData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/Blogs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(blogData),
            });

            console.log('Blog updated successfully');
            console.log(blogData);
            create();
        } catch (error) {
            console.error('Error updating blog:', error.message);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>Редактировать</Typography>
            <form onSubmit={handleFormSubmit}>
                <TextField
                    fullWidth
                    label="Название"
                    variant="outlined"
                    name="title"
                    value={blogData.title}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    required
                />

                <TextField
                    fullWidth
                    label="Описание"
                    variant="outlined"
                    name="description"
                    value={blogData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    sx={{ }}
                    required
                />

                <Button
                    variant="contained"
                    component="label"
                    sx={{ m: 2 }}
                >
                    Изображение
                    <input
                        type="file"
                        name="image"
                        hidden
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Обновить
                </Button>
            </form>
        </Box>
    );
};

export default EditBlogPage;