import React from 'react';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography, CardActions, Link } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const OneArticle = ({ article, truncateText, extractImage, likesAmount, calculateReadingTime }) => {
    if (!article) return null;

    return (
        <Card sx={{ width: 400, marginBottom: 2 }}>
            <CardHeader
                avatar={
                    <Avatar src={`${article.authorImagePath}`} aria-label="author">
                        {article.authorUserName.charAt(0)}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={article.title}
                subheader={`${article.authorUserName} · ${article.publicationDate}`}
            />
            <CardMedia
                component="img"
                height="194"
                image={extractImage(article.content)}
                alt="Article Thumbnail"
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {truncateText(article.content, 100)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {likesAmount(article.likesJson)} likes
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Link to={`/article/${article.articleId}`} style={{ marginLeft: 'auto' }}>
                    <Typography variant="body2" color="text.secondary">
                        Read More · {calculateReadingTime(article.content)} min read
                    </Typography>
                </Link>
            </CardActions>
        </Card>
    );
};

export default OneArticle;
