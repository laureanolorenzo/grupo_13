const db = require('../../../database/models');
const path = require('path');


const userProductsController = {

    async getUsuarios(req,res) {

        let usuarios = await db.Usuarios.findAll();

        let urlIndividual = 'http://localhost:3000/apiUsuario/users/' 

        const usuariosFiltrados = usuarios.map((x) => ({'id':x.id, 'nombre':x.nombre, 'email': x.email, 'url':urlIndividual+x.id}));

        res.json(usuariosFiltrados);

    },
    
    async getUsuarioId(req,res){
        let usuario = await db.Usuarios.findByPk(req.params.id);

        let usuarioNuevo = {...usuario.dataValues}
        delete usuarioNuevo.password
        delete usuarioNuevo.rol

        let urlImagen = 'http://localhost:3000/apiUsuario/users/imagenes/' + usuario.foto;
        
        usuarioNuevo.imagen = urlImagen;

        res.json({usuarioNuevo});
    },
    
    async getUsuarioImagen(req,res){
        let imagen = await db.Usuarios.findByPk(req.params.id);
        let rutaImagen = path.join(__dirname, '../../../public/images/users/' + req.params.imagen);

        res.sendFile(rutaImagen);
    }

}

module.exports = userProductsController;