const express = require('express');
const router = express.Router();
const {removeWhiteSpace} = require('../middlewares/funcs');
const path = require('path');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Multer 
const multer = require('multer');

// Storage
let multerDiskStorage = multer.diskStorage({ //Se guarda como variable para usarse luego
	filename(req,file,callback) {
		let fileName = removeWhiteSpace(req.body.title) + '-' + Date.now() + path.extname(file.originalname); // Date.now() da un numero unico, y path.extname la extension de la imagen original. Se puede combinar con datos del req, por ejempl
		callback(null,fileName) },
	destination(req,file,callback) {
		let folder = path.join(__dirname,'../../public/images/movies'); // Donde se va a guardar
		callback(null,folder);
    }
})

const productoController = require('../controllers/productoController');

const fileUpload = multer({storage: multerDiskStorage});

const multipleUpload = fileUpload.fields([{name: 'image', maxCount: 1}, {name: 'banner', maxCount: 1}]);



// Productos

router.get('/detalle_producto/:id', productoController.detalle_productoView);

router.post('/detalle_producto/borrar_producto/:id', productoController.borrar_producto);

router.get('/listado_peliculas', productoController.listado_peliculas);


// Busqueda de productos

router.post('/buscar_producto', productoController.buscar)


// Creación y edición de productos

router.get('/crear_producto',adminMiddleware, productoController.crear_productoView);

router.post('/crear_producto/process', multipleUpload, productoController.crear_productoProcess);

router.get('/editar_producto/:id',adminMiddleware, productoController.editar_productoView);

router.post('/editar_producto/process/:id',adminMiddleware, multipleUpload ,productoController.editar_producto);

//Categorias

router.get ('/categorias', productoController.allCategoriesView);

router.get('/categorias/:categoria',productoController.singleCategoryView);

// Kiosco

router.get('/kiosco',productoController.kioscoView)


module.exports = router;