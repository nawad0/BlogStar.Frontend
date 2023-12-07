import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ArticlePage = () => {
    const [article, setArticle] = useState(null);
    const { articleId } = useParams();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                console.log(articleId);
                const response = await fetch(`/api/articles/${articleId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch article - ${response.statusText}`);
                }
                const data = await response.json();
                setArticle(data);
            } catch (error) {
                console.error('Error fetching article:', error.message);
            }
        };

        fetchArticle();
    }, [articleId]);

    return (
        <div>
            {article ? (
                <div>
                    <h1>{article.title}</h1>
                    {/*<p>{article.content}</p>*/}
                    <div className="article-content" dangerouslySetInnerHTML={{ __html: article.contentHtml }}></div>
                    {/* Render other properties of the article as needed */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ArticlePage;
