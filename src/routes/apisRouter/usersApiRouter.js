const userApiController = require('../../controllers/apisController/usersApiController');
const express = require('express');
const router = express.Router();


router.get('/users', userApiController.getUsuarios);

router.get('/users/:id', userApiController.getUsuarioId);
router.get('/users/imagenes/:imagen', userApiController.getUsuarioImagen);

module.exports = router;