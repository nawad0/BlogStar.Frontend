import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './article.css'; // Import styles from the first page
import ArticleList from './components/ArticleList';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography, CardActions } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
const YourComponent = () => {
    const [articles, setArticles] = useState([]);
    const { blogId } = useParams();
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [button, setButton] = useState(true);
    const [sortBy, setSortBy] = useState('date');
    const [mode, setMode] = useState('all'); // 'all' or 'favorites'
    const [searchQuery, setSearchQuery] = useState('');
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
    }, []);

    const handleDelete = async (id) => {
        try {
            const storedToken = localStorage.getItem('jwtToken');
            const response = await fetch(`/api/articles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedToken}`,
                },
            });

            if (response.ok) {
                console.log('Blog deleted successfully');
                setArticles(articles.filter((p) => p.articleId !== id));
            } else {
                console.error('Error deleting blog:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error deleting blog:', error.message);
        }
    };

    // Function to truncate text and add ellipsis
    const truncateText = (text, maxLength) => {
        // Remove HTML tags from the text
        const withoutHtml = text.replace(/<[^>]*>/g, '');

        if (withoutHtml.length > maxLength) {
            return withoutHtml.slice(0, maxLength) + '...';
        }
        return withoutHtml;
    };

    const extractImage = (content) => {
        const match = content.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/);
        return match ? match[1] : null;
    };

    const likesAmount = (likesJson) => {
        try {
            // Преобразование строки JSON в объект JavaScript
            const likesArray = JSON.parse(likesJson);

            // Проверка, является ли полученный объект массивом
            if (Array.isArray(likesArray)) {
                // Если да, возвращаем длину массива
                return likesArray.length;
            } else {
                // Если не массив, возвращаем сообщение об ошибке или что-то еще
                return 'Provided JSON is not an array.';
            }
        } catch (error) {
            // Обработка ошибок при парсинге JSON
            return 'Error parsing JSON: ' + error.message;
        }
    };

    const calculateReadingTime = (text) => {
        // Assuming an average reading speed of 200 words per minute
        const wordsPerMinute = 200;
        const wordCount = text.split(/\s+/).length;
        const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
        return readingTimeMinutes;
    };

    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const getFilteredArticles = (articles) => {
        return articles.filter((article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const getSortedArticles = (articles) => {
        if (sortBy === 'date') {
            // Assuming each article has a 'date' field
            return [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'title') {
            // Assuming each article has a 'title' field
            return [...articles].sort((a, b) => a.title.localeCompare(b.title));
        }
        return articles;
    };

    const getRandomArticle = (articles) => {
        if (articles.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * articles.length);
        return articles[randomIndex];
    };

    const calculateAverageReadingTime = (articles) => {
        const totalReadingTime = articles.reduce((total, article) => {
            return total + calculateReadingTime(article.content);
        }, 0);

        return totalReadingTime / totalArticles;
    };

    const totalArticles = articles.length;
    const averageReadingTime = calculateAverageReadingTime(articles);
    const randomArticle = getRandomArticle(articles);

    return (
        <>
           
            <div className="container_list_blog">
                <Button
                    component={RouterLink}
                    to={`/create-article/${blogId}`}
                    variant="contained"
                    color="primary"
                    style={{ margin: 20}}
                >
                    Создать статью
                </Button>
                {/* Use the wrapper class from the first page */}
                {articles.map((article) => (
                    <Card key={article.articleId} sx={{ width: 700, marginBottom: 2 }}>
                        <CardHeader
                            avatar={
                                <Avatar src={`../${article.authorImagePath}`} aria-label="author">
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
                            {/*<LikeButton setButton={setButton} articleId={article.articleId} />*/}
                            {/*<AddToFavoriteButton articleId={article.articleId} />*/}
                            <IconButton aria-label="edit">
                                <Link
                                    to={`/edit-article/${article.articleId}`}
                                    style={{ textDecoration: 'none', color: 'inherit', fontSize: '1rem' }}
                                >
                                    <EditIcon />
                                </Link>
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => handleDelete(article.articleId)}>
                                <DeleteIcon />
                            </IconButton>
                            <Link to={`/article/${article.articleId}`} style={{ marginLeft: 'auto' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Read More · {calculateReadingTime(article.content)} min read
                                </Typography>
                            </Link>
                        </CardActions>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default YourComponent;
