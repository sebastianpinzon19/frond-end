import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  InputAdornment,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import { Edit, Delete, Info } from "@mui/icons-material";

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [formValues, setFormValues] = useState({
    titulo: "",
    descripcion: "",
    imagen: "",
    alumnos: 0,
    calificacion: 0,
    estado: true,
  });
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [usuariosInscritos, setUsuariosInscritos] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const defaultImage = "https://via.placeholder.com/50"; // URL de la imagen por defecto

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const response = await fetch("https://localhost:3000/api/cursos");
      if (!response.ok) throw new Error("Error al obtener cursos");
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      setErrorMessage("Error al obtener cursos");
      setOpenSnackbar(true);
    }
  };

  const fetchUsuariosInscritos = async (cursoId) => {
    try {
      const response = await fetch(
        `https://localhost:3000/api/cursos/${cursoId}/usuarios`
      );
      if (!response.ok) throw new Error("Error al obtener usuarios inscritos");
      const data = await response.json();
      setUsuariosInscritos(data);
    } catch (error) {
      console.error("Error al obtener usuarios inscritos:", error);
      setErrorMessage("Error al obtener usuarios inscritos");
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwitchChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.checked,
    });
  };

  const handleCreateCurso = async () => {
    try {
      const response = await fetch("https://localhost:3000/api/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const nuevoCurso = await response.json();
        setCursos([...cursos, nuevoCurso]);
        setFormValues({
          titulo: "",
          descripcion: "",
          imagen: "",
          alumnos: 0,
          calificacion: 0,
          estado: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear curso");
      }
    } catch (error) {
      console.error("Error al crear curso:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleUpdateCurso = async () => {
    try {
      const response = await fetch(
        `https://localhost:3000/api/cursos/${selectedCurso._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      if (response.ok) {
        const cursoActualizado = await response.json();
        setCursos(
          cursos.map((curso) =>
            curso._id === selectedCurso._id ? cursoActualizado : curso
          )
        );
        setSelectedCurso(null);
        setFormValues({
          titulo: "",
          descripcion: "",
          imagen: "",
          alumnos: 0,
          calificacion: 0,
          estado: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar curso");
      }
    } catch (error) {
      console.error("Error al actualizar curso:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteCurso = async () => {
    if (!selectedCurso) return;

    try {
      const response = await fetch(
        `https://localhost:3000/api/cursos/${selectedCurso._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCursos(cursos.filter((curso) => curso._id !== selectedCurso._id));
        handleCloseDeleteDialog(); // Cierra el modal de confirmación después de eliminar
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar curso");
      }
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (curso) => {
    setSelectedCurso(curso);
    setFormValues({
      titulo: curso.titulo || "",
      descripcion: curso.descripcion || "",
      imagen: curso.imagen || "",
      alumnos: curso.alumnos || 0,
      calificacion: curso.calificacion || 0,
      estado: curso.estado !== undefined ? curso.estado : true,
    });
  };

  const handleInfoClick = (curso) => {
    setSelectedCurso(curso);
    fetchUsuariosInscritos(curso._id);
    setOpenInfoDialog(true);
  };

  const handleDeleteClick = (curso) => {
    setSelectedCurso(curso);
    setOpenDeleteDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setUsuariosInscritos([]);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCurso(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  return (
    <Container>
      <h1>Gestión de Cursos:</h1>
      <form noValidate autoComplete="off">
        <TextField
          label="Título"
          name="titulo"
          value={formValues.titulo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={formValues.descripcion}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="URL de la Imagen"
          name="imagen"
          value={formValues.imagen}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Número de Alumnos"
          name="alumnos"
          type="number"
          value={formValues.alumnos}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Calificación"
          name="calificacion"
          type="number"
          value={formValues.calificacion}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">★</InputAdornment>,
          }}
        />
        <Box marginTop={2} marginBottom={2}>
          <Switch
            checked={formValues.estado}
            onChange={handleSwitchChange}
            name="estado"
            color="primary"
          />
          Estado Activo
        </Box>
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={selectedCurso ? handleUpdateCurso : handleCreateCurso}
          >
            {selectedCurso ? "Actualizar Curso" : "Crear Curso"}
          </Button>
        </Box>
      </form>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Alumnos</TableCell>
              <TableCell>Calificación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso._id}>
                <TableCell>{curso.titulo}</TableCell>
                <TableCell>{curso.descripcion}</TableCell>
                <TableCell>
                  <img
                    src={curso.imagen}
                    alt="imagen del curso"
                    width="50"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }} // Mostrar imagen por defecto si falla
                  />
                </TableCell>
                <TableCell>{curso.alumnos}</TableCell>
                <TableCell>{curso.calificacion} ★</TableCell>
                <TableCell>{curso.estado ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(curso)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleInfoClick(curso)}
                    color="info"
                  >
                    <Info />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(curso)}
                    color="secondary"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Información */}
      <Dialog
        open={openInfoDialog}
        onClose={handleCloseInfoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detalles del Curso</DialogTitle>
        <DialogContent dividers>
          {selectedCurso && (
            <Box>
              <Typography variant="h6">
                Título: {selectedCurso.titulo}
              </Typography>
              <Typography>Descripción: {selectedCurso.descripcion}</Typography>
              <Typography>Alumnos: {selectedCurso.alumnos}</Typography>
              <Typography>
                Calificación: {selectedCurso.calificacion} ★
              </Typography>
              <Typography>
                Estado: {selectedCurso.estado ? "Activo" : "Inactivo"}
              </Typography>
              <Typography>Imagen:</Typography>
              <img
                src={selectedCurso.imagen}
                alt="imagen del curso"
                width="100"
                onError={(e) => (e.target.src = defaultImage)} // Imagen por defecto en el modal también
              />
              <Box marginTop={2}>
                <Typography variant="h6">Usuarios Inscritos:</Typography>
                {usuariosInscritos.length > 0 ? (
                  <ul>
                    {usuariosInscritos.map((usuario) => (
                      <li key={usuario._id}>
                        {usuario.nombre} ({usuario.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography>
                    No hay usuarios inscritos en este curso.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Estás seguro de que quieres eliminar el curso{" "}
            <strong>{selectedCurso?.titulo}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Cancelar
          </Button>
          <Button onClick={handleDeleteCurso} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cursos;