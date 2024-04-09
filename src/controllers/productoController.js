// Creo este controller y su router para ir adelantando el tema de unificar en 3 de cada tipo. La idea es que cada funcionalidad nueva relacionada a productos
// vaya aca, y en un futuro combinamos lo que ya esta hecho

const fs = require('fs');
const path = require('path');
const db = require('../../database/models');
const {validationResult} = require('express-validator');

// Rutas
const categoriesRuta = path.join(__dirname, '../datos/categories.json');
const moviesRuta = path.join(__dirname, '../datos/movies.json');

//Funciones, datos generales, etc.
let {anio,ratingsMap,listCategories,listMovies,moviesPath} = require('../middlewares/funcs');
const { error } = require('console');

// import listCategories from '../middlewares/funcs';

const productoController = {
    
    listado_peliculas(req,res) {

        db.Peliculas.findAll()
            .then(function(productos){
                return res.render('listado_peliculas', {productos:productos})
        })
    },

    detalle_productoView(req,res) {

        db.categorias_peliculas.findAll()
            .then(function(categorias){
                db.Peliculas.findAll()
                    .then(function(detallePelicula){
                            let detalleProductoId = req.params.id;
                            return res.render('detalle_producto', {detallePelicula:detallePelicula, detalleProductoId:detalleProductoId, categorias:categorias,session:req.session});
                        })
            })
        

        // if(req.params.id){
        //     id = req.params.id
        // }
        // let movies = JSON.parse(fs.readFileSync(path.join(__dirname, '../datos/movies.json'))); 

        // let movieToShow = movies.find(movie => movie.id == id);
        // if (!movieToShow) { // Si el usuario "typea" un id a mano que no existe, lo lleva a "error"
        //     return res.redirect('/error-404');
        // } 

        // const idPelicula = req.params.id

        // movieToShow['rating'] = ratingsMap[movieToShow['rating']];
        // res.render('detalle_producto' , {datos: movieToShow, idPelicula: idPelicula, user: req.session.userLoggedIn});
    },

    buscar: async (req,res) => {
        let busqueda = req.body.barra_busqueda;
        let resultado = await db.Peliculas.findOne({
            where: {
                titulo: busqueda
            }
        })
        
        if (resultado) {
            return res.redirect(`/detalle_producto/${resultado.id}`)
        } else {
            return res.redirect('listado_peliculas')
        }
    },

    borrar_producto(req,res){

        db.Peliculas.destroy({
            where: {
                id: req.params.id
            }
        })

        res.redirect('/listado_peliculas')

        // const moviesPath = path.resolve(__dirname, '../datos/movies.json');
        // const movies = fs.readFileSync(moviesPath, 'utf-8');
        // let moviesList = JSON.parse(movies);

        // let idUrl = req.params.id

        // for (let i=0; i<(movies.length-1); i++){
        //     if (moviesList[i] != undefined && moviesList[i].id == idUrl){

        //         let nombrePoster = moviesList[i].image;
        //         let nombreBanner = moviesList[i].banner;

        //         const posterPath = path.resolve(__dirname, `../../public/images/movies/${nombrePoster}`);
        //         const bannerPath = path.resolve(__dirname, `../../public/images/movies/${nombreBanner}`);

        //         fs.unlink(posterPath, () => {null}); //para borrar las imagenes de la peli de la carpeta movies
        //         fs.unlink(bannerPath, () => {null});

        //         moviesList.splice(i,1);
        //     };
        // }

        // moviesList = JSON.stringify(moviesList,null,2);

        // fs.writeFile(moviesPath, moviesList, () => {res.redirect("/")}); //sobrescribe el archivo movies.json pero sin las peliculas que borramos
    },

    editar_productoView(req,res){
        
        let pedidoPelicula = db.Peliculas.findByPk(req.params.id);

        let pedidoGenero = db.categorias_peliculas.findAll();

        Promise.all([pedidoPelicula, pedidoGenero])
            .then(function([peliculaAEditar, genero]) {
                res.render('editar_producto', {peliculaAEditar:peliculaAEditar, genero:genero})
            })

        // db.Peliculas.findAll()
        //     .then(function(peliculaAEditar){
        //         db.categorias_peliculas.findAll()
        //             .then(function(categorias){
        //                 let detalleProductoId = req.params.id;
        //                 return res.render('editar_producto', {peliculaAEditar:peliculaAEditar, categorias:categorias, detalleProductoId:detalleProductoId})
        //             })
        //     })

        // let jsonPeliculas = listMovies()
        // let idParams = req.params.id;
        // const estructuraMovie = {
        //     categories : listCategories(), // Nuevas categorias deben ir acá!
        //     year : anio,
        //     ratings: ['1','2','3','4','5']
        // }
        // let peliAEditar = jsonPeliculas.find(jsonPeliculas => jsonPeliculas.id == idParams);

        //  res.render('editar_producto', {peliAEditar:peliAEditar,estructuraMovie:estructuraMovie, user: req.session.userLoggedIn });

    },
    
    async editar_producto(req,res){
        let updated = {
            titulo: req.body.title,
            anio: req.body.year,
            es_estreno: req.body.estreno,
            descripcion: req.body.description,
            director: req.body.director,
            reparto: req.body.cast,
            puntuacion: req.body.rating,
            clasificacion: req.body.clasificacion_edad,
            duracion: req.body.duration,
            origen: req.body.origin,
            // banner: req.files['banner']?req.files['banner'][0]['filename']:null,
            awards: req.body.awards,
            idioma: req.body.language,
            fecha_estreno: req.body.release_date,
            id_categoria_pelicula: req.body.category,
        }
        if (req.files) {
            updated['poster'] = req.files['image'][0]['filename']
            updated['local'] = 1
        }

        await db.Peliculas.update(updated
        , {
            where: {
                id: req.params.id
            }
        });
        
        res.redirect(`/detalle_producto/${req.params.id}`); 

    //    let jsonPeliculas = listMovies();
    

    //     let idParams = req.params.id; 
    //     let peliAEditar = jsonPeliculas.find(peli => peli.id == idParams); // La peli en su estado anterior

    //     if(typeof peliAEditar == "undefined" ){
    //         res.send("No se encontro la pelicula"); // Podriamos hacer un mensaje de error aca
    //     }else{
    //         // VER LO QUE LLEGA DE IMAGEN


    //         let peliEditada = {
    //             id: peliAEditar.id,
    //             title: req.body.title,
    //             year: req.body.year,
    //             estreno: req.body.estreno,
    //             description: req.body.description, 
    //             director: req.body.director, 
    //             cast: req.body.cast,
    //             rating: req.body.rating,
    //             clasificacion_edad: req.body.clasificacion_edad, 
    //             duration: req.body.duration,
    //             origin: req.body.origin,
    //             category: req.body.category,
    //             image: peliAEditar.image // Luego se va a sobreescribir si llegan imagenes.
                
    //         }
    //         // Si llegan imagenes, si llega imagen, reemplazarla. Y si llega banner, reemplazarlo.
    //         if (Object.keys(req.files).length !== 0) {
    //             // return res.send(req.files);
    //             const file = req.files;
    //             const imagesPath = path.resolve(__dirname,'../../public/images/movies');
    //             const bannerPath = path.resolve(__dirname,'../../public/images/movies'); // Por ahora lo dejamos asi. Luego ver la forma de guardar 2 archivos en carpetas separadas.
    //             if (file.image) {
    //                 if (peliAEditar.image) { // Borrar la imagen ya existente para no acumular archivos
    //                     // console.log(`${imagesPath}/${peliAEditar.image}`);
    //                     fs.unlinkSync(`${imagesPath}/${peliAEditar.image}`);

    //                 }
    //                 peliEditada['image'] = file.image[0].filename ; // Reemplazar el nombre en el json para que luego ejs pueda referenciarlo
    //             }
    //             if (peliAEditar.banner) { 
    //                 peliEditada['banner'] = file.banner !=undefined?file.banner[0].filename : peliAEditar.banner;
    //                 if (peliAEditar.banner != 'defaultBanner.jpg') { // Creo que se podria hacer con otra logica mejor
    //                     // console.log(`${bannerPath}/${peliAEditar.banner}`);
    //                     fs.unlinkSync(`${bannerPath}/${peliAEditar.banner}`)// Borrar el banner si tenia uno
    //                 }

    //             } else { //Si no habia banner y no llega, poner "defaultBanner.jpg"
    //                 peliEditada['banner'] = file.banner !=undefined?file.banner[0].filename : 'defaultBanner.jpg'; // Crearlo mas tarde
    //             }
    //         // } else {
    //         //     // return res.send(req.body)
    //         //     // res.send('Hubo un error al procesar los archivos')
    //         };

    //         let posicionPelicula = jsonPeliculas.findIndex(x => x.id == idParams)
    //         jsonPeliculas[posicionPelicula] = peliEditada;
    //         fs.writeFileSync(moviesPath, JSON.stringify(jsonPeliculas, null, " "));

    //         res.redirect('/'); 
        // } 
    
    
    },

    crear_productoView(req,res) {

        db.categorias_peliculas.findAll()
            .then(function(categorias){
                return res.render('crear_producto', {categorias:categorias})
            })



        // const admin = true;
        // const estructuraMovie = {
        //    categories : listCategories(), // Nuevas categorias deben ir acá!
        //    year : anio,
        //    ratings: ['1','2','3','4','5']
        // }
        // if (!admin) {
        //    res.send('No tiene permiso para realizar esta acción');
        // }
        // res.render('crear_producto',{estructuraMovie, user: req.session.userLoggedIn }); // Incluir objeto (que venga de JSON con los datos de cada producto)
    },

    async crear_productoProcess(req,res, next) {
        const errors = validationResult(req);
        // return res.send(errors)
        // let errorImage = errors.find(x => x.path == 'image')
        // if (errorImage){
        //     fs.unlinkSync(`../../public/images/movies/${req.files['image'][0]['filename']}`)
        // }
        if (!errors.isEmpty()) {
            let categorias = await db.categorias_peliculas.findAll()
            return res.render('crear_producto', {categorias:categorias,errors: errors.array(),old:req.body})
        } 
        await db.Peliculas.create({
            titulo: req.body.title,
            anio: req.body.release_date.split('/')[0],
            es_estreno: req.body.estreno,
            descripcion: req.body.description,
            director: req.body.director,
            reparto: req.body.cast,
            puntuacion: req.body.rating?req.body.rating:5,
            clasificacion: req.body.clasificacion_edad,
            duracion: req.body.duration,
            origen: req.body.origin,
            poster: req.files['image'][0]['filename'], //Obligatorio
            banner: req.files['banner']?req.files['banner'][0]['filename']:null,
            awards: req.body.awards,
            idioma: req.body.language,
            fecha_estreno: req.body.release_date,
            id_categoria_pelicula: req.body.category,
            local: 1 //Para que el ejs sepa que el archivo de la Imagen es local
        });

        res.redirect('/home');

        // if (req.body) {
        //     const moviesPath = path.resolve(__dirname, '../datos/movies.json');
        //     const movies = fs.readFileSync(moviesPath, 'utf-8');
        //     let lastId;
        //     let moviesObj;
        //     if (movies.length === 0) {
        //         moviesObj = [];
        //         lastId = 0;
        //     } else {
        //         moviesObj = JSON.parse(movies);
        //         lastId = moviesObj[moviesObj.length - 1].id;

        //     }
        //     let newMovie = req.body;
        //     const file = req.files;
        //     // if (!file) {
        //     //     res.send('Por favor suba una imagen para su película'); // Buscar una mejor forma de validarlo!
        //     //    return next(new Error('Por favor suba una imagen para su película'));
        //     // }
        //     // newMovie['image'] = file['filename'];            
        //     if (file.image !=undefined && file.banner !=undefined) {
        //         newMovie['image'] = file.image[0].filename;
        //         newMovie['banner'] = file.banner[0].filename;
        //         newMovie['duration'] =  newMovie['duration'] + " minutos";
        //         newMovie['id'] = lastId + 1;
        //         moviesObj.push(newMovie);
        //         fs.writeFileSync(moviesPath,JSON.stringify(moviesObj,null,2));
        //         res.redirect('/');
        //     } else {
        //         res.send('Debe agregar un póster y un banner para la película');
        //         // Para despues podemos hacer una vista con un boton que te lleve devuelta al form con los datos ya cargados.
        //     };


        // } else {
        //     next(new Error('Se ha producido un error. Por favor vuelva a intentarlo.'));
        // }

    },

    async allCategoriesView(req,res) {
        // const categoriesJson = fs.readFileSync(categoriesRuta, {'encoding': 'utf-8'});
        let categorias = await db.categorias_peliculas.findAll();

        // const moviesJson = fs.readFileSync(moviesRuta, {'encoding': 'utf-8'});
        // let movies = JSON.parse(moviesJson);
        
        res.render('todas_las_categorias',{categorias:categorias, user: req.session.userLoggedIn })
        // res.send('Hola!');
    },
    async singleCategoryView(req,res) {
        // const categoriesJson = fs.readFileSync(categoriesRuta, {'encoding': 'utf-8'});
        // let categories = JSON.parse(categoriesJson);
        const categories = await db.categorias_peliculas.findAll();

        // const moviesJson = fs.readFileSync(moviesRuta, {'encoding': 'utf-8'});
        const requestedCateg = req.params.categoria;
        const categoriaParaMostrar = await db.categorias_peliculas.findOne(
            {where: {categoria: requestedCateg}}
        )
        // let categoriaParaMostrar = categoriasDB.find(x => x.categoria == requestedCateg);
        if (categoriaParaMostrar === undefined) {
            res.send('No se encontro la categoria'); // Manejarlo distinto en el futuro?? Seria sit. en la que el usuario pone la categ. a mano
        }
        // const filteredMovies = movies.filter(movie => (movie.category == categoriaParaMostrar.titulo)); //Luego del crud combinar con id_categoria_pelicula
        const filteredMovies = await db.Peliculas.findAll(
            {where: {id_categoria_pelicula:categoriaParaMostrar.id}}
        )
        // console.log(filteredMovies);
        // res.send('HOLA')
        res.render('categorias', {datos: filteredMovies,categories:categories, user: req.session.userLoggedIn });
    },


    categoriasView(req,res) {
        // Categorias
        if (!(req.params.categoria)) {
             res.render('categorias', {datos: filteredMovies,categories:categories, user: req.session.userLoggedIn }); //Luego cambiar!!!
        } else {
        }
    },

    kioscoView(req,res) { //Kiosco
        res.render('kiosco', { user: req.session.userLoggedIn }); // Incluir objeto (que venga de JSON con los datos de cada producto)
    }
}

module.exports = productoController;