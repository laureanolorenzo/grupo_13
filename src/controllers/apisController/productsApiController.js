const db = require('../../../database/models');
const path = require('path');


productsApiController = {

    async getProductos (req,res) {

        let todosLosProductos = await db.Peliculas.findAll();
        let categorias = await db.categorias_peliculas.findAll();
        
        
        let cantidadPorCategoria = [];
        contador = 0;
        
        for (let i in categorias){
            let cantidadCategoriaActual = 0;
            let idCategoriaActual = categorias[i].id;
            let nombreActual = categorias[i].titulo;
            for (let j in todosLosProductos){
                if (todosLosProductos[j].id_categoria_pelicula == idCategoriaActual){
                    cantidadCategoriaActual++;
                }
            }
            cantidadPorCategoria.push({'nombre de la categoría': nombreActual, 'cantidad de productos': cantidadCategoriaActual});
        }
        
        let urlIndividual = 'http://localhost:3000/apiProductos/products/';

        function encontrarCategoria(pk){
            for (let i in categorias){
                if (categorias[i].id == pk){
                    return categorias[i].titulo;
                }
            }
        }
        
        const productos = await todosLosProductos.map( (x) => (
            {
                'id':x.id, 
                'titulo':x.titulo, 
                'descripción':x.descripcion, 
                'estreno':x.es_estreno, 
                'fecha de estreno':x.fecha_estreno, 
                'clasificacion':x.clasificacion, 
                'idioma':x.idioma, 
                'duracion':x.duracion,
                'categoria': encontrarCategoria(x.id_categoria_pelicula),
                'url':urlIndividual+x.id
            }
        ));

        let cantidadTotalProductos = todosLosProductos.length;

        res.json({'count':cantidadTotalProductos, 'countByCategory':cantidadPorCategoria, 'products':productos});
    },

    async getProductoId (req, res){

        let productoPorId = await db.Peliculas.findByPk(req.params.id);

        let idCategoriaPelicula = productoPorId.id_categoria_pelicula;

        let tituloCategoria = await db.categorias_peliculas.findByPk(idCategoriaPelicula);

        let urlImagen = '';
        let nombreImagen = productoPorId.poster;

        let inicioNombreImagen = '';

        for (let i=0; i<=7; i++){
            inicioNombreImagen += nombreImagen[i];
        }
        if (inicioNombreImagen == 'https://'){
            urlImagen = productoPorId.poster
        } else {
            urlImagen = 'http://localhost:3000/apiProductos/products/imagenes/' + productoPorId.poster;
        }

        let productoModificado = {...productoPorId.dataValues}
        delete productoModificado.director;
        delete productoModificado.reparto;
        delete productoModificado.puntuacion;
        delete productoModificado.poster;
        delete productoModificado.banner;
        delete productoModificado.awards;
        delete productoModificado.origen;
        delete productoModificado.id_categoria_pelicula;
        delete productoModificado.tmdb_id;
        delete productoModificado.local;

        res.json({'producto':productoModificado, 'categoria':tituloCategoria.titulo, 'url imagen':urlImagen})
    },

    async getPeliculaPoster (req,res){
        let rutaImagen = path.join(__dirname, '../../../public/images/movies/' + req.params.poster);

        res.sendFile(rutaImagen);
        
    }

}

module.exports = productsApiController;