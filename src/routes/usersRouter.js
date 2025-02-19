const usersController = require('../controllers/usersController');
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const path = require ('path');
const multer = require ('multer');
const db = require('../../database/models');
const bcrypt = require('bcryptjs');

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
    body('rol').notEmpty().withMessage('Debe seleccionar un rol'),
    body('avatar').custom((value, {req}) => {
        let file = req.file;
        let acceptedExtensions = ['.jpg','.jpeg', '.png', '.gif'];
        let fileExtension;
        if (!file) {
            throw new Error('Debes subir una imagen de alguno de los siguientes formatos: JPG, JPEG, PNG, GIF')
        } else {
            fileExtension = path.extname(file.originalname)
        }
        if (!acceptedExtensions.includes(fileExtension)){
            throw new Error('El formato de la imagen debe ser JPG, JPEG, PNG o GIF')
        }
        return true;
    })
];

const validacionesLogin = [
    body('email').notEmpty().withMessage('Debe ingresar un email').bail().isEmail().withMessage('El email ingresado no es válido').bail().custom(async(value, {req} ) => {
        await db.Usuarios.findAll()
            .then(function(usuarios){
                let mailExistente = false;
                for (let i in usuarios){
                    if (usuarios[i].email === req.body.email){
                        mailExistente = true;
                    }
                }
                if (!mailExistente){
                    throw new Error('El email ingresado no está registrado');
                }
            })
    }),
    body('password').notEmpty().withMessage('Ingrese su contraseña').bail().custom(async(value, {req}) => {
        await db.Usuarios.findAll()
            .then(function(usuarios){
                for (let i in usuarios){
                    if (usuarios[i].email == req.body.email){
                        if (!bcrypt.compareSync(req.body.password, usuarios[i].password)){
                            throw new Error('La contraseña es incorrecta');
                        }
                    }
                }
            })
    })
]

fileUpload = multer({storage: multerDiskStorage});
singleUpload = fileUpload.single('avatar');

// Metodos

router.get('/usuario', usersController.usersView);

// router.post ('/usuario', uploadFile.single('users'), usersController.usersRegister);

router.get('/registro', guestMiddleware, usersController.registerView);

router.post('/registro', singleUpload, validacionesRegistro, usersController.postRegisterData);

// Siempre mandar multer antes en el router: https://stackoverflow.com/questions/63632356/multer-and-express-validator-creating-problem-in-validation

// router.get('/login', usersController.loginView);

// router.post('/login', usersController.postLoginData);



router.get('/login', guestMiddleware, usersController.login);

router.post('/login/process',validacionesLogin, usersController.loginProcess);



// router.get('/perfil/:id', ingresarAPerfilMiddleware, usersController.profile);
router.get('/perfil',ingresarAPerfilMiddleware, usersController.profile)

router.get('/cerrarSesion', usersController.logout)


router.get('/editar_usuario', usersController.editar_usuarioView);

router.post('/editar_usuario/process',singleUpload, usersController.editar_usuarioProcess);

module.exports = router; //