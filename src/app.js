import carritoRouter from './routes/carrito.router.js'
import express from 'express'
import handlebars from 'express-handlebars';
import productosRouter from './routes/productos.router.js'
import userRouter from './routes/user.router.js'
import mongoose from 'mongoose';


const app = express()
const productManager= new ProductManager("./src/public/archivos/productos.json");

mongoose.connect('mongodb+srv://nicolaschaves1991:iYm9g3zcwk40HyyF@coderhousebackend.uunghaj.mongodb.net/?retryWrites=true&w=majority').then(() => {
    // Conexión exitosa
    console.log('Conexión a la base de datos establecida');
    // Resto de tu código aquí
  })
  .catch((error) => {
    // Error en la conexión
    console.error('Error al conectar a la base de datos:', error);
  });

// Config engine templates
app.engine('handlebars', handlebars.engine())
app.set('views','./src/views')
app.set('view engine', 'handlebars')
app.use(express.static('./src/public'))

mongoose.connect('mongodb+srv://nicolaschaves1991:iYm9g3zcwk40HyyF@coderhousebackend.uunghaj.mongodb.net/?retryWrites=true&w=majority').then(() => {
    // Conexión exitosa
    console.log('Conexión a la base de datos establecida');
    // Resto de tu código aquí
  })
  .catch((error) => {
    // Error en la conexión
    console.error('Error al conectar a la base de datos:', error);
  });

// Config engine templates
app.engine('handlebars', handlebars.engine())
app.set('views','./src/views')
app.set('view engine', 'handlebars')
app.use(express.static('./src/public'))

app.use(express.json())
app.use('/static', express.static('public'))

app.use('/api/productos', productosRouter)
app.use('/api/carts', carritoRouter)
app.use('/api/users',userRouter)


app.listen(8080, () => console.log("Servidor arriba en el puerto 8080"))