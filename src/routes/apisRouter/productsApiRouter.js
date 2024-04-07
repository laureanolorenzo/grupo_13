const productsApiController = require('../../controllers/apisController/productsApiController');
const express = require('express');
const router = express.Router();

router.get('/products', productsApiController.getProductos);
router.get('/products/:id', productsApiController.getProductoId);
router.get('/products/imagenes/:poster', productsApiController.getPeliculaPoster);

module.exports = router;