import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const AddToFavoriteButton = ({ articleId, setButton, articles }) => {
    const [loading, setLoading] = useState(false);
    const [favoriteArticles, setFavoriteArticles] = useState([]);

    const handleAddToFavorite = async () => {
        setButton(true);
        try {
            setLoading(true);
           
            const storedToken = localStorage.getItem('jwtToken');
            // Replace 'BASE_URL' with the actual URL of your server
            const response = await axios.post(
                `auth/article?articleId=${articleId}`,
                null,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${storedToken}`,
                    },
                }
            );
            
            console.log(response.data);
            setButton(false);
        } catch (error) {
            console.error('Error adding article to favorites:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

   

    return (
        <IconButton onClick={handleAddToFavorite} disabled={loading}>
            {
                articles.some((article) => article.articleId === articleId) ? (
                    <BookmarkIcon />
                ) : (
                    <BookmarkBorderIcon />
                )
            }
        </IconButton>
    );
};

export default AddToFavoriteButton;
