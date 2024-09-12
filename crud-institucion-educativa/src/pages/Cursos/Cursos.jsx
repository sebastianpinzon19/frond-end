import React, { useState, useEffect } from 'react';
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@mui/material';

const defaultImage = 'https://via.placeholder.com/150'; // URL de la imagen por defecto

const Cursos = () => {
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        try {
            const response = await fetch('https://localhost:3000/api/cursos/');
            if (!response.ok) throw new Error('Error al obtener cursos');
            const data = await response.json();
            setCursos(data);
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            setErrorMessage('Error al obtener cursos');
            setOpenSnackbar(true);
        }
    };

    const handleDeleteCurso = async () => {
        // Lógica para eliminar el curso
        setOpenDeleteDialog(false);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorMessage('');
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Cursos Disponibles
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cursos.map((curso) => (
                            <TableRow key={curso._id}>
                                <TableCell>{curso.titulo}</TableCell>
                                <TableCell>{curso.descripcion}</TableCell>
                                <TableCell>
                                    <Button onClick={() => { setSelectedCurso(curso); setOpenDeleteDialog(true); }}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Eliminar Curso</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que deseas eliminar el curso "{selectedCurso?.titulo}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="default">Cancelar</Button>
                    <Button onClick={handleDeleteCurso} color="primary">Eliminar</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para mensajes */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Cursos;