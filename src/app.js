const express = require('express');
const path = require('path');
const fs = require('fs');
const methodOverride = require('method-override');
const session = require('express-session');
const app = express();
const {v4} = require('uuid'); // Forma mas segura de generar secretos y session_ids
const loggedInMiddleware = require('./middlewares/loggedInMiddleware');
// const bodyParser = require('body-parser');


const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

// Para poder acceder a la info de post
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Method override
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//express-session
app.use(session({
  secret: v4(),
  resave: false,
  saveUninitialized: false,
  cookie: {secure:false}
}));



// Rutas

const rutaCarrito = require('./routes/carritoRouter');
const rutaUsuarios = require ('./routes/usersRouter');
const rutaHome = require('./routes/mainRouter');
const rutaProducto = require('./routes/productoRouter');
const rutaTMDB = require('./routes/tmdbRouter');
const rutaAPI = require('./routes/apiRouter');

//cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser())
// body parser
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Usos de los routers
app.use(loggedInMiddleware);  //Para setear "user" en locals si esta logueado. No podia acceder a req.session desde EJS

app.use(rutaHome);


app.use(rutaCarrito);


app.use (rutaUsuarios);



// Uso de los routers principales

app.use(rutaProducto);

app.use(rutaTMDB);

app.use('/api',rutaAPI);
// Servidor
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

let homePath = path.resolve(__dirname, 'views/home.html');
// app.get('/', (req, res) => res.sendFile(homePath)); //View del home
// app.get('/home', (req, res) => res.sendFile(homePath));

// Resto de los archivos. Con esto ya deberían funcionar sin importar el nombre que se les ponga.
const htmlFiles = fs.readdirSync(path.resolve(__dirname, 'views'));
// for (const file of htmlFiles) {
//     let fileName;
//     let filePath;
//     fileName = file.split('.')[0];
//     filePath = path.resolve(__dirname, `views/${fileName}.html`);
//     if (fileName !== 'home') {
//         app.get(`/${fileName}`, (req, res) => res.sendFile(filePath));
//     }
// }

// Metodo post para el home (Para que al enviar el formulario login me devuelva al home)
// app.post('/',(req,res) => res.sendFile(homePath));
// app.post('/login', (req,res) => res.sendFile(homePath));
// app.post('/register', (req,res) => res.sendFile(homePath));