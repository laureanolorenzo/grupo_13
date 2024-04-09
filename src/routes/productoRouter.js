const express = require('express');
const router = express.Router();
const {removeWhiteSpace} = require('../middlewares/funcs');
const path = require('path');
const adminMiddleware = require('../middlewares/adminMiddleware');
const {body} = require('express-validator');
const checkField = require('../middlewares/validationFuncs');
const db = require('../../database/models');
// Multer 
const multer = require('multer');
const fs = require('fs');

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

// Validaciones 
const validacionesProducto = [
	body('title').notEmpty().withMessage('La película debe contener un título.').isLength({min:2,max:255})
	.withMessage('El título puede contener entre 2 y 255 caracteres como máximo')
	.custom(
		async (value) => {
			await checkField(value,db,'titulo')
		}),
	body('estreno').notEmpty().withMessage('Por favor seleccione si su película se estrena o no.'),
	body('description').notEmpty().withMessage('Por favor escriba una descripción para su película')
	.isLength({min:2,max:255}).withMessage('La descripción debe contener entre 2 y 255 caracteres'),
	body('director').notEmpty().withMessage('Por favor especifique un director para su película')
	.isLength({min:2,max:255}).withMessage('El director debe contener entre 2 y 255 caracteres'),
	body('cast').notEmpty().withMessage('Por favor especifique el reparto de su película')
	.isLength({min:2,max:255}).withMessage('El reparto debe contener entre 2 y 255 caracteres'),
	body('clasificacion_edad').notEmpty().withMessage('Debe especificar la calificación de edad de su película')
	.isLength({min:2,max:100}).withMessage('La clasificación debe contener entre 2 y 100 caracteres'),
	body('duration').notEmpty().withMessage('Debe especificar la duración de su película').isNumeric().withMessage('Por favor ingrese una duración válida')
	.custom(value => 1 < value < 300 ).withMessage('Su película no puede durar más de 300 minutos'),
	body('origin').notEmpty().withMessage('Debe especificar el origen de su película')
	.isLength({min:2,max:255}).withMessage('El origen debe contener entre 2 y 255 caracteres'),
	body('category').notEmpty().withMessage('Debe especificar el género de su película'),
	body('awards').notEmpty().withMessage('Debe especificar el género de su película'),
	body('category').notEmpty().withMessage('Debe especificar el género de su película'),
	body('language').notEmpty().withMessage('Debe especificar el idioma de su película')
	.isLength({min:2,max:20}).withMessage('El idioma  debe contener entre 2 y 20 caracteres'),
	body('release_date').notEmpty().withMessage('Debe especificar la fecha de estreno de su película'),
	body('image')
	.custom((value, {req}) => {
        let file = req.files.image?req.files['image'][0]:null; //Obligatorio
		if (!file) {
			throw new Error('Por favor suba un poster para su película'); // null, osea que no trae archivo
		}
        let acceptedExtensions = ['.jpg','.jpeg', '.png'];
        let fileExtension;
        if (!file) {
            throw new Error('Debes subir una imagen de alguno de los siguientes formatos: JPG, JPEG, PNG, GIF')
        } else {
            fileExtension = path.extname(file.originalname)
        }
        if (!acceptedExtensions.includes(fileExtension)){
			let unlinkPath = path.join(__dirname,'../../public/images/movies/' + file.filename)
			fs.unlinkSync(unlinkPath)
            throw new Error('El formato del poster debe ser JPG, JPEG o PNG')
        }
        return true;
    }),

	body('banner').custom((value, {req}) => {
        let file = req.files['banner']?req.files['banner'][0]:null;
		if (!file) {
			return true; // null, osea que no trae archivo
		}
        let acceptedExtensions = ['.jpg','.jpeg', '.png'];
        let fileExtension;
        if (!file) {
            throw new Error('Debes subir una imagen de alguno de los siguientes formatos: JPG, JPEG, PNG, GIF')
        } else {
            fileExtension = path.extname(file.originalname)
        }
        if (!acceptedExtensions.includes(fileExtension)){
			let unlinkPath = path.join(__dirname,'../../public/images/movies/' + file.filename)
			fs.unlinkSync(unlinkPath)
            throw new Error('El formato del banner debe ser JPG, JPEG o PNG')
        }
        return true;
    })



]

// Productos

router.get('/detalle_producto/:id', productoController.detalle_productoView);

router.post('/detalle_producto/borrar_producto/:id', productoController.borrar_producto);

router.get('/listado_peliculas', productoController.listado_peliculas);


// Busqueda de productos

router.post('/buscar_producto', productoController.buscar)


// Creación y edición de productos

router.get('/crear_producto',adminMiddleware, productoController.crear_productoView);

router.post('/process', multipleUpload,validacionesProducto, productoController.crear_productoProcess);

router.get('/editar_producto/:id',adminMiddleware, productoController.editar_productoView);

router.post('/editar_producto/process/:id',adminMiddleware, multipleUpload ,productoController.editar_producto);

//Categorias

router.get ('/categorias', productoController.allCategoriesView);

router.get('/categorias/:categoria',productoController.singleCategoryView);

// Kiosco

router.get('/kiosco',productoController.kioscoView)


module.exports = router;