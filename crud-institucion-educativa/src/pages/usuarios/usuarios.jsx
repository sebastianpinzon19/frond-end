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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Info,
  Add,
} from "@mui/icons-material";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]); // Almacena todos los cursos
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    email: "",
    password: "",
    estado: true,
    imagen: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openAddCursosDialog, setOpenAddCursosDialog] = useState(false); // Modal para agregar cursos
  const [selectedCursos, setSelectedCursos] = useState([]); // Cursos seleccionados para asociar al usuario
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const defaultImage = "https://via.placeholder.com/58";

  useEffect(() => {
    fetchUsuarios();
    fetchCursos(); // Cargar los cursos cuando se cargue el componente
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("https://localhost:3000/api/usuarios");
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsuarios(data.filter((usuario) => usuario.estado));
    } catch (error) {
      handleError(error, "Error al obtener usuarios");
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await fetch("https://localhost:3000/api/cursos");
      if (!response.ok) throw new Error("Error al obtener cursos");
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      handleError(error, "Error al obtener cursos");
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

  const handleCreateUsuario = async () => {
    try {
      const response = await fetch("https://localhost:3000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear usuario");
      }
      await fetchUsuarios();
      resetForm();
    } catch (error) {
      handleError(error, "Error al crear usuario");
    }
  };

  const handleUpdateUsuario = async () => {
    if (!selectedUsuario?.email) return;

    try {
      const response = await fetch(
        `https://localhost:3000/api/usuarios/${selectedUsuario.email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar usuario");
      }

      await fetchUsuarios();
      resetForm();
    } catch (error) {
      handleError(error, "Error al actualizar usuario");
    }
  };

  const handleDeleteUsuario = async () => {
    if (!selectedUsuario?.email) return;

    try {
      const response = await fetch(
        `https://localhost:3000/api/usuarios/${selectedUsuario.email}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar usuario");
      }

      await fetchUsuarios();
      handleCloseDeleteDialog();
    } catch (error) {
      handleError(error, "Error al eliminar usuario");
    }
  };

  const handleEditClick = (usuario) => {
    setSelectedUsuario(usuario);
    setFormValues({
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      password: usuario.password || "",
      estado: usuario.estado ?? true,
      imagen: usuario.imagen || "",
    });
  };

  const handleDeleteClick = (usuario) => {
    setSelectedUsuario(usuario);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (usuario) => {
    setSelectedUsuario(usuario);
    try {
      const response = await fetch(
        `https://localhost:3000/api/usuarios/${usuario._id}/cursos`
      );
      if (!response.ok)
        throw new Error("Error al obtener la información del usuario");
      const cursos = await response.json();
      setUsuarioInfo({ ...usuario, cursos });
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
      setUsuarioInfo({ ...usuario, cursos: [] });
    }

    setOpenInfoDialog(true);
  };

  const handleAddCursosClick = async (usuario) => {
    setSelectedUsuario(usuario)
    try {
      const response = await fetch(
        `https://localhost:3000/api/usuarios/${usuario._id}/cursos`
      );
      if (!response.ok) throw new Error("Error al obtener cursos del usuario");
      const cursosUsuario = await response.json();
      setSelectedCursos(cursosUsuario.map((curso) => curso._id)); // Preselecciona los cursos ya asociados
    } catch (error) {
      handleError(error, "Error al obtener cursos del usuario");
    }
    setOpenAddCursosDialog(true);
  };

  const handleSaveCursos = async () => {
    if (!selectedUsuario) return;

    try {
      const response = await fetch(
        `https://localhost:3000/api/usuarios/${selectedUsuario.email}/cursos`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cursos: selectedCursos }), // Solo envía los IDs de los cursos
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al asociar cursos al usuario"
        );
      }
      await fetchUsuarios();
    } catch (error) {
      handleError(error, "Error al asociar cursos al usuario");
    }
    setOpenAddCursosDialog(false);
  };

  const handleCursosChange = (cursoId) => {
    if (selectedCursos.includes(cursoId)) {
      setSelectedCursos(selectedCursos.filter((id) => id !== cursoId));
    } else {
      setSelectedCursos([...selectedCursos, cursoId]);
    }
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setUsuarioInfo(null);
  };

  const handleCloseAddCursosDialog = () => {
    setOpenAddCursosDialog(false);
    setSelectedCursos([]);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUsuario(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (selectedUsuario) {
      handleUpdateUsuario();
    } else {
      handleCreateUsuario();
    }
  };

  const resetForm = () => {
    setSelectedUsuario(null);
    setFormValues({
      nombre: "",
      email: "",
      password: "",
      estado: true,
      imagen: "",
    });
  };

  const handleError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    setErrorMessage(error.message || defaultMessage);
    setOpenSnackbar(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="nombre"
          label="Nombre"
          value={formValues.nombre}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="email"
          label="Email"
          value={formValues.email}
          onChange={handleInputChange}
          disabled={selectedUsuario !== null}
        />
        <TextField
          fullWidth
          margin="normal"
          name="password"
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={formValues.password}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Box display="flex" alignItems="center" marginY={2}>
          <Switch
            name="estado"
            checked={formValues.estado}
            onChange={handleSwitchChange}
          />
          <Typography>Estado Activo</Typography>
        </Box>
        <TextField
          fullWidth
          margin="normal"
          name="imagen"
          label="Imagen"
          value={formValues.imagen}
          onChange={handleInputChange}
        />
        <Button type="submit" variant="contained" color="primary">
          {selectedUsuario ? "Actualizar Usuario" : "Crear Usuario"}
        </Button>
      </form>
      <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.email}>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.estado ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <img
                    src={usuario.imagen || defaultImage}
                    alt={usuario.nombre}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                    onError={(e) => (e.target.src = defaultImage)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(usuario)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(usuario)}
                    color="secondary"
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    onClick={() => handleInfoClick(usuario)}
                    color="info"
                  >
                    <Info />
                  </IconButton>
                  <IconButton
                    onClick={() => handleAddCursosClick(usuario)}
                    color="primary"
                  >
                    <Add />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{"Confirmar eliminación"}</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar al usuario{" "}
            {selectedUsuario?.nombre}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteUsuario} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal mas informacion*/}
      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
        <DialogTitle>{"Información del Usuario"}</DialogTitle>
        <DialogContent>
          {usuarioInfo && (
            <>
              <Typography>
                <strong>Nombre:</strong> {usuarioInfo.nombre}
              </Typography>
              <Typography>
                <strong>Email:</strong> {usuarioInfo.email}
              </Typography>
              <Typography>
                <strong>Estado:</strong>{" "}
                {usuarioInfo.estado ? "Activo" : "Inactivo"}
              </Typography>
              <Typography>
                <strong>Cursos inscritos:</strong>
              </Typography>
              {usuarioInfo.cursos && usuarioInfo.cursos.length > 0 ? (
                <ul>
                  {usuarioInfo.cursos.map((curso, index) => (
                    <li key={index}>{curso.titulo}</li>
                  ))}
                </ul>
              ) : (
                <Typography>No está inscrito en ningún curso</Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Agregar Cursos*/}
      <Dialog open={openAddCursosDialog} onClose={handleCloseAddCursosDialog}>
        <DialogTitle>{"Agregar Cursos al Usuario"}</DialogTitle>
        <DialogContent>
          <List>
            {cursos.map((curso) => (
              <ListItem
                key={curso._id}
                button
                onClick={() => handleCursosChange(curso._id)}
              >
                <Checkbox checked={selectedCursos.includes(curso._id)} />
                <ListItemText primary={curso.titulo} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddCursosDialog}>Cancelar</Button>
          <Button onClick={handleSaveCursos} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Usuarios;