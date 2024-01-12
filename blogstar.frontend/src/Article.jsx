import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommentForm from './CommentForm';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { Typography, CircularProgress, Container } from '@mui/material'; // Import Material-UI components

const ArticlePage = () => {
    const [article, setArticle] = useState(null);
    const { articleId } = useParams();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
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
        <Container sx={{ marginTop: 4, marginBottom: 4, padding: 3 }}>
            {article ? (
                <div>
                    <Typography variant="h4" gutterBottom>
                        {article.title}
                    </Typography>
                    <ReactQuill
                        value={article.content}
                        readOnly={true}
                        theme={"bubble"} // You can choose "snow" for a different style
                        style={{ marginTop: '1rem' }}
                    />
                    <CommentForm articleId={articleId} />
                </div>
            ) : (
                <CircularProgress sx={{ marginTop: 4 }} />
            )}
        </Container>
    );
};

export default ArticlePage;
