const usersController = require('../controllers/usersController');
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const path = require ('path');
const multer = require ('multer');

const guestMiddleware = require('../middlewares/guestMiddleware');
const ingresarAPerfilMiddleware = require('../middlewares/ingresarAPerfilMiddleware');
const {removeWhiteSpace} = require('../middlewares/funcs');

let multerDiskStorage = multer.diskStorage({ //Se guarda como variable para usarse luego
	filename(req,file,callback) {
		let fileName = removeWhiteSpace(req.body.username) + '-' + Date.now() + path.extname(file.originalname); // Date.now() da un numero unico, y path.extname la extension de la imagen original. Se puede combinar con datos del req, por ejempl
		callback(null,fileName) },
	destination(req,file,callback) {
		let folder = path.join(__dirname,'../../public/images/users'); // Donde se va a guardar
		callback(null,folder);
    }
})

//validaciones
const validacionesRegistro = [
    body('username').notEmpty().withMessage('Este campo no puede estar vacío').bail().isLength({min: 2}).withMessage('El valor ingresado debe tener al menos 2 caracteres'),
    body('email').notEmpty().withMessage('Este campo no puede estar vacío').bail().isEmail().withMessage('El email ingresado no es válido'),
    body('password').notEmpty().withMessage('Este campo no puede estar vacío').bail().isLength({min: 8}).withMessage('El valor ingresado debe tener al menos 8 caracteres'),
    body('repeat_password').notEmpty().withMessage('Este campo no puede estar vacío').bail().isLength({min: 8}).withMessage('El valor ingresado debe tener al menos 8 caracteres')
];

fileUpload = multer({storage: multerDiskStorage});
singleUpload = fileUpload.single('avatar');

// const userValidations = [
//     body('email').notEmpty().withMessage('*Por favor escriba su correo electrónico').isLength({min: 5, max: 40}).withMessage('*Email inválido'),
//     body('username').notEmpty().withMessage('*Por favor escriba su nombre de usuario').isLength({min:3, max:40}).withMessage('El usuario debe tener 3 a 40 caracteres'),
//     body('password').notEmpty().withMessage('*Por favor escriba una contraseña').isLength({min:3, max:40}).withMessage('La contraseña debe tener 3 a 40 caracteres'),
//     body('repeat_password').notEmpty().withMessage('*Por favor repita su contraseña'),
    
// ]

const userLoginValidations = [
    body('email').notEmpty().withMessage('*Por favor escriba su usuario o correo electrónico'),
    body('password').notEmpty().withMessage('*Debe escribir su contraseña')
]
// Metodos

router.get('/usuario', usersController.usersView);

// router.post ('/usuario', uploadFile.single('users'), usersController.usersRegister);

router.get('/registro', guestMiddleware, usersController.registerView);

router.post('/registro', singleUpload, validacionesRegistro, usersController.postRegisterData);

// Siempre mandar multer antes en el router: https://stackoverflow.com/questions/63632356/multer-and-express-validator-creating-problem-in-validation

// router.get('/login', usersController.loginView);

// router.post('/login', usersController.postLoginData);



router.get('/login', guestMiddleware, usersController.login);

router.post('/login/process',userLoginValidations, usersController.loginProcess);



// router.get('/perfil/:id', ingresarAPerfilMiddleware, usersController.profile);
router.get('/perfil',ingresarAPerfilMiddleware, usersController.profile)

router.get('/cerrarSesion', usersController.logout)


router.get('/editar_usuario', usersController.editar_usuarioView);

router.post('/editar_usuario/process',singleUpload, usersController.editar_usuarioProcess);

module.exports = router; //