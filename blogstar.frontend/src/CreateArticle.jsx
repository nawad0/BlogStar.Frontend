import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './CreateArticle.css'; // Подключаем стили (если у вас есть)
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Импорт стилей для Quill


const CreateArticle = () => {
    const { blogId } = useParams();
    const [articleData, setArticleData] = useState({
        title: '',
        content: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setArticleData({ ...articleData, [name]: value });
    };

    const handleContentChange = (value) => {
        setArticleData({ ...articleData, content: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const storedToken = localStorage.getItem('jwtToken');
            const response = await fetch(`/api/articles/?blogId=${blogId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedToken}`,
                },
                body: JSON.stringify({ ...articleData, contentHtml: articleData.content }),
            });

            const newArticle = await response.json();
            console.log('New article created:', newArticle);
        } catch (error) {
            console.error('Error creating a new article:', error.message);
        }
    };

    return (
        <div className="create-article-container">
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={articleData.title}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="content">Content:</label>
                <ReactQuill
                    theme="snow"
                    value={articleData.content}
                    onChange={handleContentChange}
                    required
                />

                {/* Добавляем превью HTML-контента */}
                <div className="content-preview" dangerouslySetInnerHTML={{ __html: articleData.content }}></div>

                {/* Добавляем кнопку для создания статьи */}
                <button type="submit" className="create-article-button">Create Article</button>
            </form>
        </div>
    );
};

export default CreateArticle;
