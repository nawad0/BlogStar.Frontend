import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddToFavoriteButton = ({ articleId }) => {
    const [loading, setLoading] = useState(false);
    const [favoriteArticles, setFavoriteArticles] = useState([]);
    const handleAddToFavorite = async () => {
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
                        Authorization: `Bearer ${storedToken}`, // Include the Authorization header with the token
                        // Add any other necessary headers
                    },
                }
            );
            fetchFavoriteArticles();
            console.log(response.data); // Handle a successful response from the server
        } catch (error) {
            console.error('Error adding article to favorites:', error.response?.data || error.message);
            // Handle errors if needed
        } finally {
            setLoading(false);
        }
    };
    const fetchFavoriteArticles = async () => {
        const storedToken = localStorage.getItem('jwtToken');
        try {
            const response = await axios.get('auth/favorite-articles', {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                    // Add any other necessary headers
                },
            });

            setFavoriteArticles(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching favorite articles:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        
        fetchFavoriteArticles();
       
    }, []);

    return (
        
        
        <div onClick = { handleAddToFavorite } disabled = { loading } >
            {
                favoriteArticles.some((article) => article.articleId === articleId) ? (
                    <>
                        <img src="src/assets/bookmark.svg" alt="Remove from Favorites" />
                    </>
                ) : (
                    <>
                            <img src="src/assets/bookmarkfill.svg" alt="Add to Favorites" />
                    </>
                )
            }
        </div>
    );
};

export default AddToFavoriteButton;
