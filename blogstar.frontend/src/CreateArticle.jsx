import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreateArticle.css'; // Include your custom styles
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import imageCompression from 'browser-image-compression';
const CreateArticle = () => {
    const { blogId } = useParams();
    const [articleData, setArticleData] = useState({
        title: '',
        content: '',
    });

    const compressImages = async (htmlContent) => {
        const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
        const images = doc.querySelectorAll('img');

        for (let img of images) {
            // Преобразование изображения в Blob для сжатия
            const response = await fetch(img.src);
            const blob = await response.blob();

            // Настройки сжатия
            const options = {
                maxSizeMB: 0.1, // Максимальный размер в MB
                maxWidthOrHeight: 1920, // Максимальная ширина или высота
                useWebWorker: true,
            };

            // Сжатие изображения
            const compressedBlob = await imageCompression(blob, options);
            const compressedFile = new File([compressedBlob], 'image.jpg', { type: 'image/jpeg' });

            // Чтение сжатого изображения в формате base64
            const base64String = await readImageAsBase64(compressedFile);

            // Обновление src изображения
            img.src = `data:${compressedFile.type};base64,${base64String}`;
        }

        return doc.body.innerHTML;
    };

    const readImageAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setArticleData({ ...articleData, [name]: value });
    };

    const handleContentChange = (value) => {
        setArticleData({ ...articleData, content: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Сначала сжимаем изображения
        const compressedContent = await compressImages(articleData.content);

        try {
            const storedToken = localStorage.getItem('jwtToken');
            const response = await fetch(`/api/articles/?blogId=${blogId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedToken}`,
                },
                body: JSON.stringify({ ...articleData, content: compressedContent }),
            });

            const newArticle = await response.json();
            console.log('New article created:', newArticle);
            window.location.href = `/articles/${blogId}`;
        } catch (error) {
            console.error('Error creating a new article:', error.message);
        }
    };
    
    // Define modules and formats for ReactQuill
    // ... (previous code)

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['blockquote', 'code-block'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }], // Add align button
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            ['clean'],
        ],
    };

    // ... (remaining code)


    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image', 'video',
        'blockquote', 'code-block',
        'script',
        'indent', 'direction',
        'size', 'color', 'background',
    ];

    return (
        <div className="container_a mt-5">
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={articleData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content:</label>
                    <ReactQuill
                        theme="snow"
                        value={articleData.content}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        placeholder="Write something amazing..."
                        required
                    />
                </div>

                <div className="mb-3">
                    {/* Preview HTML content */}
                    {/* <div className="preview" dangerouslySetInnerHTML={{ __html: articleData.content }}></div> */}
                </div>

                <button type="submit" className="btn btn-primary">Create Article</button>
            </form>
        </div>
    );
};

export default CreateArticle;
