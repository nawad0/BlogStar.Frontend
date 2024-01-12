import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgress } from '@mui/material';
import LikeButton from './LikeButton';
import AddToFavoriteButton from './AddToFavoriteButton';

const ArticleList = ({ articles, setButton, truncateText, extractImage, likesAmount, calculateReadingTime,favorite }) => {
    return (
        <div className="articleList">
            {articles.length > 0 ? (
                articles.map((article) => (
                    <Card key={article.articleId} sx={{ width: 700, marginBottom: 2 }}>
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
                                {truncateText(article.content, 10)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {likesAmount(article.likesJson)} likes
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <LikeButton setButton={setButton} articleId={article.articleId} />
                            <AddToFavoriteButton articles={favorite} setButton={setButton} articleId={article.articleId} />
                            <Link to={`/article/${article.articleId}`} style={{ marginLeft: 'auto' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Read More · {calculateReadingTime(article.content)} min read
                                </Typography>
                            </Link>
                        </CardActions>
                    </Card>
                ))
            ) : (
                    <Typography variant="body1" color="text.secondary">
                        К сожалению, статьи не найдены.
                    </Typography>
            )}
        </div>
    );
};

export default ArticleList;
