import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import "./article.css";

const YourComponent = () => {
    const [articles, setArticles] = useState([]);
    const { blogId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedToken = localStorage.getItem('jwtToken');

                const response = await fetch(`/api/articles/blog-articles?blogId=${blogId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch articles - ${response.statusText}`);
                }

                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error('Error fetching articles:', error.message);
            }
        };

        fetchData();
    }, [blogId]);

    // Функция для обрезки текста и добавления троеточия
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    return (
        <div className="article-list-container">
            {articles.map((article) => (
                <Link to={`/article/${article.articleId}`} key={article.articleId} className="article-card-link">
                    <div className="article-card">
                        <h3 className="article-title">{article.title}</h3>
                        <p className="article-content">{truncateText(article.content, 20)}</p>
                        {/* Render other properties of the article as needed */}
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default YourComponent;
