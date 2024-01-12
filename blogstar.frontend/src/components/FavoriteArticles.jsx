import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Divider, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import ArticleList from './ArticleList';

const FavoriteArticles = () => {
    const [favoriteArticles, setFavoriteArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [button, setButton] = useState(true);
    const [sortedArticles, setSortedArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date'); // 'date' or 'title'

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };
    const likesAmount = (likesJson) => {
        try {
            // �������������� ������ JSON � ������ JavaScript
            const likesArray = JSON.parse(likesJson);

            // ��������, �������� �� ���������� ������ ��������
            if (Array.isArray(likesArray)) {
                // ���� ��, ���������� ����� �������
                return likesArray.length;
            } else {
                // ���� �� ������, ���������� ��������� �� ������ ��� ���-�� ���
                return 'Provided JSON is not an array.';
            }
        } catch (error) {
            // ��������� ������ ��� �������� JSON
            return 'Error parsing JSON: ' + error.message;
        }
    };

    const sortAndFilterArticles = (articlesToSort, sortBy, searchQuery) => {
        let filteredArticles = [...articlesToSort];

        // Filter by search query
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filteredArticles = filteredArticles.filter(
                (article) =>
                    article.title.toLowerCase().includes(lowerCaseQuery) ||
                    article.content.toLowerCase().includes(lowerCaseQuery)
            );
        }

        // Sort
        if (sortBy === 'date') {
            filteredArticles.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
        } else if (sortBy === 'title') {
            filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
        }

        setSortedArticles(filteredArticles);
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
                sortAndFilterArticles(response.data, sortBy, searchQuery);
            } catch (error) {
                console.error('Error fetching favorite articles:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteArticles();
    }, [sortBy, searchQuery, button]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Divider />
            <div className="sortOptions">
                <FormControl variant="standard" style={{ marginRight: 20 }}>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        label="Sort by"
                    >
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="title">Title</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="searchBar">
                <TextField
                    label="Search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    variant="standard"
                />
            </div>
            <ArticleList
                articles={sortedArticles}
                setButton={setButton}
                truncateText={truncateText}
                extractImage={extractImage}
                likesAmount={likesAmount}
                calculateReadingTime={calculateReadingTime}
            />
        </div>
    );
};

export default FavoriteArticles;
