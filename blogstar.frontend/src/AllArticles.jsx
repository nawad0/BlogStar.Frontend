import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddToFavoriteButton from './components/AddToFavoriteButton';
import FavoriteArticles from './components/FavoriteArticles';
import LikeButton from './components/LikeButton';


const ArticleListPage = () => {
    const [articles, setArticles] = useState([]);
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [button, setButton] = useState(true);
    const [sortedArticles, setSortedArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date'); // 'date' or 'title'
    const [mode, setMode] = useState('all'); // 'all' or 'favorites'

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('/api/articles');
                if (!response.ok) {
                    throw new Error(`Failed to fetch articles - ${response.statusText}`);
                }
                const data = await response.json();
                setArticles(data);

                setLikes(data.likes);
                setLoading(false);
                // Sort articles initially based on the default criteria
                sortAndFilterArticles(data, sortBy, searchQuery);
            } catch (error) {
                console.error('Error fetching articles:', error.message);
                setLoading(false);
            }
        };

        fetchArticles();
    }, [sortBy, searchQuery, button]);

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
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

    const handleSortChange = (value) => {
        setSortBy(value);
        sortAndFilterArticles(articles, value, searchQuery);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        sortAndFilterArticles(articles, sortBy, value);
    };

    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
    };

    return (
        <div className="container">
            <div className="modeSwitch">
                <button onClick={() => handleModeChange('all')} className={mode === 'all' ? 'activeMode' : ''}>
                    All Articles
                </button>
                <button onClick={() => handleModeChange('favorites')} className={mode === 'favorites' ? 'activeMode' : ''}>
                    Favorite Articles
                </button>
            </div>

            {mode === 'all' ? (
                <>
                    <h1 className="pageTitle">Article List</h1>
                    <div className="articleListWrapper">
                        <div className="articleList">
                            {loading ? (
                                <p className="loading">Loading...</p>
                            ) : (
                                <div>
                                        {sortedArticles.map((article) => (
                                            //<Link to={`/article/${article.articleId}`} className="articleLink" key={article.articleId}>
                                            <div key={article.articleId} className="articleItem">
                                                <div className="articleInfo">
                                                    <p className="articleAuthorDate">
                                                        {article.authorUserName} · {article.publicationDate}
                                                    </p>
                                                    <h3 className="articleTitle">{article.title}</h3>
                                                    <div
                                                        className="articleContent"
                                                        dangerouslySetInnerHTML={{ __html: truncateText(article.content, 10) }}
                                                    />
                                                    <p>{likesAmount(article.likesJson)}</p>
                                                    <AddToFavoriteButton articleId={article.articleId} />
                                                    <Link to={`/articles/${article.blogId}`} className="blogInfo">
                                                        перейти к блогу · {calculateReadingTime(article.content)} min read
                                                    </Link>
                                                </div>
                                                <LikeButton setButton={setButton} articleId={article.articleId} />
                                                <div className="articleThumbnail">
                                                    {article.content && (
                                                        <img
                                                            src={extractImage(article.content)}
                                                            alt="Article Thumbnail"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        //</Link>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="separator"></div>
                        <div className="sortOptions">
                            <label>Sort by:</label>
                            <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                                <option value="date">Date</option>
                                <option value="title">Title</option>
                            </select>
                        </div>
                        <div className="searchBar">
                            <label>Search:</label>
                            <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} />
                        </div>
                    </div>
                </>
            ) : (
                <FavoriteArticles />
            )}
        </div>
    );
};

export default ArticleListPage;
