import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Snackbar, Alert } from '@mui/material';
import { Edit, Delete, Info } from '@mui/icons-material';

const MasInformacion = () => {
    const [info, setInfo] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/informacion');
            if (!response.ok) throw new Error('Error al obtener información');
            const data = await response.json();
            setInfo(data);
        } catch (error) {
            console.error('Error al obtener información:', error);
            setErrorMessage('Error al obtener información');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorMessage('');
    };

    return (
        <Container>
            <Typography variant="h1" gutterBottom>Más Información</Typography>
            <Box marginBottom={2}>
                <Button variant="contained" color="primary" onClick={fetchInfo}>
                    Actualizar Información
                </Button>
            </Box>
            <Box>
                {info.map((item) => (
                    <Box key={item.id} marginBottom={2} padding={2} border={1} borderRadius={4}>
                        <Typography variant="h5">{item.titulo}</Typography>
                        <Typography>{item.descripcion}</Typography>
                        <Box marginTop={1}>
                            <Button variant="outlined" color="primary" startIcon={<Edit />}>
                                Editar
                            </Button>
                            <Button variant="outlined" color="secondary" startIcon={<Delete />}>
                                Eliminar
                            </Button>
                            <Button variant="outlined" color="info" startIcon={<Info />}>
                                Más Info
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default MasInformacion;
