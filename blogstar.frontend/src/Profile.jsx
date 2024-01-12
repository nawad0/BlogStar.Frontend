import React, { useEffect, useState } from 'react';
import axios from 'axios'
import ProfileBlog from './components/ProfileBlog';
import FavoriteArticles from './components/FavoriteArticles';
import ProfileAticles from './components/ProfileAticles';
import { Container, Box, Typography, CircularProgress, Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { Divider } from '@mui/material';
import EditProfile from './EditProfile';
import MyModal from './components/UI/MyModal/MyModal';
const Profile = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    useEffect(() => {
        const fetchUser = async () => {
            const storedToken = localStorage.getItem('jwtToken');
            try {
                const response = await axios.get('auth/user', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                setUser(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching favorite articles:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [modal]);
    const create = () => {
        setModal(false);
    };

    if (loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container>
                <Typography variant="h5">User not found</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                my={4}
                sx={{
                    backgroundColor: '#f5f5f5', // Светло-серый цвет
                    width: '100%',
                    padding: '20px',
                }}
            >
                
                <Avatar src={`${user.userImagePath}`} alt="User Avatar" sx={{ width: 128, height: 128 }} />
                <Typography variant="h4" gutterBottom>
                    {user.userName}
                </Typography>
                <IconButton aria-label="edit" onClick={() => setModal(true)}>
                    <EditIcon />
                </IconButton>
                <Typography>{user.email}</Typography>
                <Typography>С нами с  {new Date(user.registrationDate).toLocaleDateString()}</Typography>
            </Box>
          
            <Box display="flex" justifyContent="space-evenly" flexDirection ="column" alignItems = "center" my={4}>
                {/*<div>*/}
                {/*    <Typography variant="h6" style={{margin: 20}}>Избранные статьи</Typography>*/}
                {/*    <ProfileAticles />*/}
                {/*</div>*/}
                {/*<Divider orientation="vertical" flexItem sx={{ borderRightWidth: 'thick'}} />*/}
                {/*<div>*/}
                {/*    <Typography variant="h6" style={{ margin: 20 }}>Блог пользователя</Typography>*/}
                   
                {/*</div>*/}
                <Typography variant="h6" style={{ margin: 20 }}>Блог пользователя</Typography>
                <ProfileBlog />
            </Box>
            <MyModal visible={modal} setVisible={setModal}>
                <EditProfile create={create} />
            </MyModal>
           
        </Container>
    );
};

export default Profile;
