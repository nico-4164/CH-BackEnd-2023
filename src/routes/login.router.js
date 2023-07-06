import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Configuracion de express-session
router.use(
  session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: false
  })
);

// Ruta GET para mostrar el formulario de inicio de sesión
router.get('/', async (req, res) => {
  try {
    res.render('login');
  } catch (error) {
    console.log("No se pudo conectar a mongoose: " + error);
  }
});

// Ruta POST para el formulario de inicio de sesión
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === 'user@coder.com' && password === 'pass') {
      req.session.user = { email };
      return res.redirect('/api/productos');
    } else {
      return res.render('login', { error: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.log("Error al autenticar al usuario: " + error);
  }
});

export default router;
