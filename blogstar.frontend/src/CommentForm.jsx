import React, { useState, useEffect } from 'react';
import {
    Container,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Divider,
    TextField,
    FormGroup,
    Button,
} from '@mui/material';

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
                    Authorization: `Bearer ${storedToken}`, // Replace with your actual auth token
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
                    Authorization: `Bearer ${storedToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch comments - ${response.statusText}`);
            }

            const data = await response.json();
            setComments(data);
            console.log(data);
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
        <Container>
            <Typography variant="h4" gutterBottom>
                Comments
            </Typography>

            <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
                {comments.map((comment) => (
                    <React.Fragment key={comment.commentId}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar src={`  ${comment.authorImagePath}`} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={comment.authorName}
                                secondary={comment.text}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>

            <form onSubmit={handleFormSubmit}>
                <FormGroup>
                    <TextField
                        label="Comment"
                        multiline
                        rows={4}
                        variant="outlined"
                        name="text"
                        value={commentData.text}
                        onChange={handleInputChange}
                        required
                    />
                </FormGroup>

                {/* Add other form fields as needed */}

                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                    Post Comment
                </Button>
            </form>

            {loading && <Typography>Loading comments...</Typography>}
            {error && <Typography style={{ color: 'red' }}>Error: {error}</Typography>}
        </Container>
    );
};

export default CommentForm;
