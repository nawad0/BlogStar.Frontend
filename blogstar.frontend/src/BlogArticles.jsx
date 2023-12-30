import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './article.css'; // Import styles from the first page

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
                        Authorization: `Bearer ${storedToken}`,
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

    // Function to truncate text and add ellipsis
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    return (
        <>
            <Link to={`/create-article/${blogId}`} className="blog-title">
                Создать статью
            </Link>
            <div className="articleListWrapper"> {/* Use the wrapper class from the first page */}
                <div className="articleList">
                    {articles.map((article) => (
                        <Link to={`/article/${article.articleId}`} key={article.articleId} className="articleLink">
                            <div className="articleItem">
                                <div className="articleInfo">
                                    <h3 className="articleTitle">{article.title}</h3>
                                    <p className="articleContent">{truncateText(article.content, 20)}</p>
                                    {/* Render other properties of the article as needed */}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default YourComponent;
