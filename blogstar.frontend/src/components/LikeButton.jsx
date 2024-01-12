import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const LikeButton = ({ articleId, setButton }) => {
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = async () => {
        const storedToken = localStorage.getItem('jwtToken');
        try {
            setButton(true);
            const response = await fetch(`/api/Articles/add?articleId=${articleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedToken}`,
                    // Include any additional headers if needed
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to add like - ${response.status} ${response.statusText}`);
            }
            setButton(false);
            setIsLiked(!isLiked); // Toggle like state
        } catch (error) {
            console.error('Error adding like:', error.message);
        }
    };

    const checkLikeStatus = async () => {
        try {
            const storedToken = localStorage.getItem('jwtToken');
            const response = await axios.get(`/api/Articles/checklike?articleId=${articleId}`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    Accept: 'application/json',
                },
            });

            console.log(response.data);

            // Assuming the response contains a property 'HasLiked'
            setIsLiked(response.data.hasLiked);
        } catch (error) {
            console.error('Error checking like status:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        // Fetch the initial like status when the component mounts
        checkLikeStatus();
    }, []);

    return (
        <IconButton onClick={handleLike} color={isLiked ? 'secondary' : 'default'}>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
    );
};

export default LikeButton;
