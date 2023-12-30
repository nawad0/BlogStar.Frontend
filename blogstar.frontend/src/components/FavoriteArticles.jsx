import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FavoriteArticles = () => {
    const [favoriteArticles, setFavoriteArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Define the extractImage function
    const extractImage = (content) => {
        const match = content.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/);
        return match ? match[1] : null;
    };
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
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

        fetchFavoriteArticles();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="articleListWrapper">
            <div className="articleList">
                <h1 className="pageTitle">Favorite Articles</h1>
                {favoriteArticles.length === 0 ? (
                    <p>No favorite articles found.</p>
                ) : (
                    <ul>
                        {favoriteArticles.map((article) => (
                            <li key={article.id}>
                                <div className="articleItem">
                                    <div className="articleInfo">
                                        <p className="articleAuthorDate">
                                            {article.authorUserName} · {article.publicationDate}
                                        </p>
                                        <h3 className="articleTitle">{article.title}</h3>
                                        <div
                                            className="articleContent"
                                            dangerouslySetInnerHTML={{ __html: truncateText(article.content, 10) }}
                                        />
                                        
                                        <Link to={`/articles/${article.blogId}`} className="blogInfo">
                                            перейти к блогу · {calculateReadingTime(article.content)} min read
                                        </Link>
                                    </div>
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
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FavoriteArticles;
