import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddToFavoriteButton from './components/AddToFavoriteButton';
import FavoriteArticles from './components/FavoriteArticles';
import LikeButton from './components/LikeButton';
import ArticleList from './components/ArticleList';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Divider, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress } from '@mui/material';

import OneArticle from './components/OneArticle';
const ArticleListPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [button, setButton] = useState(true);
    const [sortBy, setSortBy] = useState('date'); 
    const [mode, setMode] = useState('all'); // 'all' or 'favorites'
    const [favoriteArticles, setFavoriteArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('/api/articles', {
                    headers: {  
                        'Content-Type': 'application/json',
                    },
                });
                // Axios handles the response status internally. If the status is not 2xx, it will throw an error.
                setArticles(response.data);
                console.log("Все Статьи");
            } catch (error) {
                // With Axios, error handling is a bit different. You get the response from error.response
                console.error('Error fetching articles:', error.response?.data || error.message);
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
       
        fetchArticles();
    }, [button]);



    const truncateText = (text, maxLength) => {
        // Remove HTML tags from the text
        const withoutHtml = text.replace(/<[^>]*>/g, '');

        if (withoutHtml.length > maxLength) {
            return withoutHtml.slice(0, maxLength) + '...';
        }
        return withoutHtml;
    };

    const extractImage = (content) => {
        const match = content.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/);
        return match ? match[1] : null;
    };

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

    const calculateReadingTime = (text) => {
        // Assuming an average reading speed of 200 words per minute
        const wordsPerMinute = 200;
        const wordCount = text.split(/\s+/).length;
        const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
        return readingTimeMinutes;
    };

    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const getFilteredArticles = (articles) => {
        return articles.filter((article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const getSortedArticles = (articles) => {
        if (sortBy === 'date') {
            // Assuming each article has a 'date' field
            return [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'title') {
            // Assuming each article has a 'title' field
            return [...articles].sort((a, b) => a.title.localeCompare(b.title));
        }
        return articles;
    };

    const getRandomArticle = (articles) => {
        if (articles.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * articles.length);
        return articles[randomIndex];
    };

    const calculateAverageReadingTime = (articles) => {
        const totalReadingTime = articles.reduce((total, article) => {
            return total + calculateReadingTime(article.content);
        }, 0);

        return totalReadingTime / totalArticles;
    };

    const totalArticles = articles.length;
    const averageReadingTime = calculateAverageReadingTime(articles);
    const randomArticle = getRandomArticle(articles);
    return (
        <div className="container_a">
            <div className="list_container">
                <div className="switch_container">
                    <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={(event, newMode) => {
                            if (newMode !== null) {
                                handleModeChange(newMode);
                            }
                        }}
                        aria-label="article mode"
                    >
                        <ToggleButton value="all" aria-label="all articles">
                            Все статьи
                        </ToggleButton>
                        <ToggleButton value="favorites" aria-label="favorite articles">
                            Избранные
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {mode === 'all' ? (
                    <div>
                        <h1 className="pageTitle">Лента</h1>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <ArticleList
                                articles={getSortedArticles(getFilteredArticles(articles))}
                                favorite={favoriteArticles}
                                setButton={setButton}
                                truncateText={truncateText}
                                extractImage={extractImage}
                                likesAmount={likesAmount}
                                calculateReadingTime={calculateReadingTime}
                            />
                        )}
                    </div>
                ): (
                    <div>
                        <h1 className="pageTitle">Избранные</h1>
                        {loading ? (
                                <CircularProgress />
                        ) : (
                            <ArticleList
                                articles={getSortedArticles(getFilteredArticles(favoriteArticles))}
                                favorite={favoriteArticles}
                                setButton={setButton}
                                truncateText={truncateText}
                                extractImage={extractImage}
                                likesAmount={likesAmount}
                                calculateReadingTime={calculateReadingTime}
                            />
                        )}
                    </div>
                )}
            </div>
            <div className="sort_container">
                <div className="sortOptions" style={{ marginTop: 100 }} >
                    <h3>Сортировка</h3>
                    <FormControl variant="standard" style={{ marginRight: 20, width: 300 }}>
                        <InputLabel>Сортировать по</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            label="Sort by"
                        >
                            <MenuItem value="date">Дате</MenuItem>
                            <MenuItem value="title">Названию</MenuItem>
                        </Select>
                    </FormControl >
                    <div className="searchBar">
                        <TextField
                            label="Search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            variant="standard"
                            style={{ width: 300 }}
                        />
                    </div>
                    <div className="articleStatistics" style={{ marginTop: 20 }}>
                        <h3>Статистика</h3>
                        <p>Всего статей {totalArticles}</p>
                        <p>Среднее время чтения: {averageReadingTime.toFixed(2)} minutes</p>
                        
                    </div>

                    {randomArticle && (
                        <div className="randomArticle">
                            <h3>Интересно узнать</h3>
                            <OneArticle
                                article={randomArticle}
                                truncateText={truncateText}
                                extractImage={extractImage}
                                likesAmount={likesAmount}
                                calculateReadingTime={calculateReadingTime}
                            />
                        </div>
                    )}
                </div>
                
            </div>
           
        </div>
    );

};

export default ArticleListPage;
