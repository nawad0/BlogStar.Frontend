import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./blog-create.css";

const CreateBlogPage = ({ create }) => {
    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        // Add other blog properties as needed
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogData({ ...blogData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(blogData);

        try {
            const storedToken = localStorage.getItem('jwtToken');
            const response = await fetch('/api/Blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedToken}`, // replace with your actual access token
                },
                body: JSON.stringify(blogData),
            });

            const newBlog = await response.json();
            console.log('New blog created:', newBlog);

            // Clear the form data
            setBlogData({
                title: '',
                description: '',
                // Add other blog properties as needed
            });

            create();
        } catch (error) {
            console.error('Error creating a new blog:', error.message);
            // Handle error, e.g., display an error message to the user
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5 }}>
            <Typography variant="h4" gutterBottom>Создать блог</Typography>
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
                    sx={{ mb: 2 }}
                    required
                />

                {/* Add other form fields as needed */}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Создать блог
                </Button>
            </form>
        </Box>
    );
};

export default CreateBlogPage;
