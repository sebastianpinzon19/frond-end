import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Snackbar, Alert, Card, CardContent, CardActions } from '@mui/material';
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
            const response = await fetch('https://localhost:3000/api/informacion');
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
        <Container maxWidth="md">
            <Typography variant="h2" gutterBottom align="center" sx={{ mb: 4 }}>
                Más Información
            </Typography>
            <Box textAlign="center" mb={4}>
                <Button variant="contained" color="primary" onClick={fetchInfo}>
                    Actualizar Información
                </Button>
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
                {info.map((item) => (
                    <Card key={item.id} sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {item.titulo}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {item.descripcion}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="outlined" color="primary" startIcon={<Edit />}>
                                Editar
                            </Button>
                            <Button variant="outlined" color="error" startIcon={<Delete />}>
                                Eliminar
                            </Button>
                            <Button variant="outlined" color="info" startIcon={<Info />}>
                                Más Info
                            </Button>
                        </CardActions>
                    </Card>
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
