import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommentForm from './CommentForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card } from 'react-bootstrap'; // Import Bootstrap components

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
        <Container>
            {article ? (
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>{article.title}</Card.Title>
                                <Card.Text dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
                                {/* Render other properties of the article as needed */}
                            </Card.Body>
                        </Card>
                        <CommentForm articleId={articleId} />
                    </Col>
                </Row>
            ) : (
                <p>Loading...</p>
            )}
        </Container>
    );
};

export default ArticlePage;
