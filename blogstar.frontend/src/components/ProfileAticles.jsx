import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Divider, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import ArticleList from './ArticleList';

const ProfileAticles = () => {
    const [favoriteArticles, setFavoriteArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [button, setButton] = useState(true);
    

    const likesAmount = (likesJson) => {
        try {
            // Преобразование строки JSON в объект JavaScript
            const likesArray = JSON.parse(likesJson);

            // Проверка, является ли полученный объект массивом
            if (Array.isArray(likesArray)) {
                // Если да, возвращаем длину массива
                return likesArray.length;
            } else {
                // Если не массив, возвращаем сообщение об ошибке или что-то еще
                return 'Provided JSON is not an array.';
            }
        } catch (error) {
            // Обработка ошибок при парсинге JSON
            return 'Error parsing JSON: ' + error.message;
        }
    };

    // Define the extractImage function
    const extractImage = (content) => {
        const match = content.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/);
        return match ? match[1] : null;
    };

    const truncateText = (text, maxLength) => {
        // Remove HTML tags from the text
        const withoutHtml = text.replace(/<[^>]*>/g, '');

        if (withoutHtml.length > maxLength) {
            return withoutHtml.slice(0, maxLength) + '...';
        }
        return withoutHtml;
    };

    const calculateReadingTime = (text) => {
        // Assuming an average reading speed of 200 words per minute
        const wordsPerMinute = 200;
        const wordCount = text.split(/\s+/).length;
        const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
        return readingTimeMinutes;
    };

    useEffect(() => {
        const fetchFavoriteArticles = async () => {
            const storedToken = localStorage.getItem('jwtToken');
            try {
                const response = await axios.get('auth/favorite-articles', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                setFavoriteArticles(response.data);
               
            } catch (error) {
                console.error('Error fetching favorite articles:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteArticles();
    }, [button]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ArticleList
                articles={favoriteArticles}
                favorite={favoriteArticles}
                setButton={setButton}
                truncateText={truncateText}
                extractImage={extractImage}
                likesAmount={likesAmount}
                calculateReadingTime={calculateReadingTime}
            />
        </div>
    );
};

export default ProfileAticles;
