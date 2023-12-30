import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CommentForm = ({ articleId }) => {
    const [commentData, setCommentData] = useState({
        text: '',
        // Add other comment properties as needed
    });

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCommentData({ ...commentData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const storedToken = localStorage.getItem('jwtToken');
            const response = await fetch(`/api/comments?articleId=${articleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`, // Replace with your actual auth token
                },
                body: JSON.stringify(commentData),
            });

            if (!response.ok) {
                throw new Error(`Failed to create comment - ${response.statusText}`);
            }

            const newComment = await response.json();
            console.log('New comment created:', newComment);

            // Clear the form data
            setCommentData({
                text: '',
                // Add other comment properties as needed
            });

            // Fetch updated comments after posting a new comment
            fetchComments();
        } catch (error) {
            console.error('Error creating a new comment:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            setLoading(true);

            const storedToken = localStorage.getItem('jwtToken');
            const response = await fetch(`/api/comments/article?articleId=${articleId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch comments - ${response.statusText}`);
            }

            const data = await response.json();
            setComments(data);
            setError(null); // Reset error if fetching is successful
        } catch (error) {
            console.error('Error fetching comments:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch comments when the component mounts
        fetchComments();
    }, [articleId]);

    return (
        <div>

            <h2>Comments</h2>
            <ListGroup>
                {comments.map((comment) => (
                    <ListGroup.Item key={comment.commentId}>{comment.text}</ListGroup.Item>
                    // Add other comment properties as needed
                ))}
            </ListGroup>

            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="text">
                    <Form.Label>Comment:</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="text"
                        value={commentData.text}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                {/* Add other form fields as needed */}

                <Button type="submit" variant="primary" style={{ marginTop: '10px' }}>
                    Post Comment
                </Button>
            </Form>

            {loading && <p>Loading comments...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

           
        </div>
    );
};

export default CommentForm;
