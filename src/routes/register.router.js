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
    res.render('register');
  } catch (error) {
    console.log("No se pudo conectar a mongoose: " + error);
  }
});


export default router;
