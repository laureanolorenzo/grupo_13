const userProductsController = require('../../controllers/apisController/userProductsController');
const express = require('express');
const router = express.Router();


router.get('/users', userProductsController.getUsuarios);

router.get('/users/:id', userProductsController.getUsuarioId);
router.get('/users/imagenes/:imagen', userProductsController.getUsuarioImagen);

module.exports = router;