const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname,'../datos/users.json');

// const User = require('../../models/User');
const session = require('express-session');
const cookie = require('cookie-parser');
const db = require('../../database/models');
const {Op} = require('sequelize');
const app = require('express');
const {validationResult} = require('express-validator');
const { error } = require('console');
function checkPasswordValidity(pw) { //Donde va esto?? En un archivo aparte??
    let [upper,lower,digit,alpha] = [false,false,false,false];
    let forbiddenChars = ['#', '%', '&', '{', '}', '\\', '<', '>', '*', '?', '/', ' ', '$', '!', "'", '"', ':', '@', '+', '`', '|', '=',':','.'];
    const re = new RegExp('^[a-zA-Z]$');
    try {
        for (const char of pw.split('')) {
            if (char.toUpperCase() === char) {
                upper = true;
            }
            if (char.toLowerCase() === char) {
                lower = true;
            } 
            if (!isNaN(parseInt(char))) {
                digit = true;
            }
            if (forbiddenChars.includes(char)) {
                return false;
            }
            if (re.test(char)) {
                alpha = true;
            }
        }
    } catch(e) {
        return false // No retorno el error porque queremos que vaya al usuario
    }
    return (upper && lower && digit && alpha);
}

const usersController = {
    async usersView(req,res) {
        // const user = await db.findByPk(req.session.userLoggedIn.idUsuario);
        // res.render('perfilUsuario', { user: req.session.userLoggedIn }); // Incluir objeto (que venga de JSON con los datos de cada producto)
        res.render('perfilUsuario'); // Incluir objeto (que venga de JSON con los datos de cada producto)
    },

    // usersRegister (req,res){
    //     return res.send ({
    //         body: req.body,
    //         file: req.file
    //     })
    // },

    registerView(req,res) {
        db.roles.findAll()
        .then(function(roles){
            return res.render('registro', {roles:roles})
        })
    },
    
    async postRegisterData(req,res) {
        
        let errores = validationResult(req);
        let errorMail = '';
        
        await db.Usuarios.findAll()
            .then(function(usuarios){
                for (let i in usuarios){
                    if (usuarios[i].email === req.body.email){
                        db.roles.findAll()
                        .then(function(){
                            errorMail = 'El email ingresado ya está registrado';
                        })
                    }
                }
            })

        if (errores.isEmpty()){
            await db.Usuarios.create({
                nombre: req.body.username,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password),
                foto: req.file?.filename, //No viene en body! 
                id_rol: req.body.rol,
            });
            res.redirect('/home');
        } else{
            // res.send(errores)
            db.roles.findAll()
            .then(function(roles){
                return res.render('registro',{roles:roles, errores:errores.array(), old:req.body, errorMail:errorMail})
            })
        }


        
        // let emailInDB = User.findByField('email', req.body.email);
        // let userInDB = User.findByField('user',req.body.user);
        // let errors = validationResult(req).mapped(); 
        // if (emailInDB) { //Case mejor?? O directamente una funcion que reciba un booleano
        //     if (Object.keys(errors).length != 0) {
        //         errors['email'] = {msg:'*El email ya está en uso'}
        //     } else {
        //         errors = {email:{msg:'*El email ya está en uso'}};
        //     }
        // }
        // if (userInDB) {
        //     if (Object.keys(errors).length != 0) {
        //         errors['user'] = {msg:'*El nombre de usuario no está disponible'};
        //     } else {
        //         errors = {user:{msg:'*El nombre de usuario no está disponible'}};
        //     }
        // }
        // if (req.body.password != req.body.passwordRepeat) { // Hay mejores formas de hacer esto???
        //     if (Object.keys(errors).length == 0) { //si el email ya está registrado te recarga la pagina y no te crea el usuario, 
        //         errors = {password:{msg:'*Las contraseñas deben coincidir'}}
        //     } else {
        //         errors['password'] = errors.password ? errors.password : {msg: '*Las contraseñas deben coincidir'};
        //     }
        // }
        // if (!checkPasswordValidity(req.body.password)) {
        //     errors['password'] = errors?.password? errors.password : {msg:'*La contraseña debe contener al menos una letra minúscula, una letra mayúscula, y un número, y sólo puede contener caracteres alfanuméricos'};
        // }
        // // If final por si hay errores o no
        // if (Object.keys(errors).length > 0) { // Un solo check al final
        //     if (errors.password && errors.passwordRepeat) {
        //         delete errors.passwordRepeat
        //     }
        //     return res.render('registro',{
        //         errors,
        //         oldData: req.body,
        //         user: req.session.userLoggedIn
        //     })
        // } else {
        //     userData = {
        //         ...req.body,
        //         'profilePic': req.file?.filename ? req.file.filename : 'default-profilePic.jpg'
        //     }
        //     User.create(userData);
        //     res.redirect('home');
        // }



        // LO DE ARRIBA ERA LO ANTERIOR

        // let usersString = fs.readFileSync(usersPath,{encoding:'utf-8'});
        // let users = JSON.parse(usersString);
        // let user = {};
        // user.username = req.body.user;
        // user.email = req.body.email;
        // user.password = bcrypt.hashSync(req.body.password);
        // user.passwordRepeat = bcrypt.hashSync(req.body.passwordRepeat);
        // user.id = 1;
        // console.log(users);
        // let lastUser = users.pop(); //saca el ultimo valor ingresado para despues usar su id
        // if (!users || users.length==0){
        //     users = [];
        // } else {
        //     user.id = lastUser.id + 1; //saca un nuevo numero de id sumandole 1 al id del valor que sacamos antes
        // }
        // users.push(lastUser); //devuelve el lastUser al archivo
        // users.push(user);   //agrega el nuevo usuario al archivo
        // usersToSave = JSON.stringify(users, null, " ");
        // fs.writeFileSync(usersPath,usersToSave,{encoding: 'utf-8'})
        // res.redirect('home')
    },

    // loginView(req,res) {
    //     let usersString = fs.readFileSync(path.join(__dirname,'../datos/users.json'),{encoding:'utf-8'});
    //     let users = JSON.parse(usersString);
    //     res.render('login',{'errormsg':''});
    // },

    // postLoginData(req,res) {
    //     let usersString = fs.readFileSync(path.join(__dirname,'../datos/users.json'),{encoding:'utf-8'});
    //     let users = JSON.parse(usersString);
    //     const username = req.body.user;
    //     const password = req.body.password;
    //     let user = users.find((u) => u.username === username);
    //     if (user && user['password'] !== password) {
    //         res.render('login',{'errormsg':'La contraseña es incorrecta'});
    //     } else if (!(user)) {
    //         res.render('login',{'errormsg':'No se ha encontrado al usuario'});
            
    //     } else if (user && user['password'] === password) {

    //         req.session.idUsuario = user.id;

    //         res.redirect('home');
    //     }
        
    // },

    login: (req,res) => {
        return res.render('login');
    },

    loginProcess: async (req,res) => {
        let errorMsg;
        let errores = validationResult(req);


        if (errores.isEmpty()){
            const userToLog = await db.Usuarios.findOne({
                where: {[Op.or] : {
                    nombre: req.body.email,
                    email: req.body.email
                    }
                }
            })
            // if (!userToLog) {
            //     errorMsg = 'Usuario o contraseña incorrectos'
            //     return res.render('login',{'errormsg':errorMsg});
            // }
            req.session.idUsuario = userToLog.id;
            delete userToLog.password
            delete userToLog.passwordRepeat
            req.session.userLoggedIn = userToLog;
            res.locals.userLoggedIn = userToLog; // https://stackoverflow.com/questions/56698453/express-session-cannot-set-property-user-of-undefined
            res.redirect('/home'); //Login exitoso
            // if (bcrypt.compareSync(req.body.password,userToLog.password)) {
            // } else {
            //     errorMsg = 'Usuario o contraseña incorrectos'
            //     return res.render('login',{'errormsg':errorMsg});
            // }
        } else {
            // res.send(errores)
            return res.render('login', {errores:errores.array(), old:req.body});
        }


        // let userToLogin = User.findByField(['email','user'], req.body.email)
        // let errors = validationResult(req).mapped();
        // if (userToLogin) {
        //     let passwordCompared = bcrypt.compareSync(req.body.password, userToLogin.password);
        //     if (passwordCompared) {
        //         delete userToLogin.password
        //         delete userToLogin.passwordRepeat
        //         req.session.userLoggedIn = userToLogin;
        //         res.locals.userLoggedIn = req.session.userToLogin; // https://stackoverflow.com/questions/56698453/express-session-cannot-set-property-user-of-undefined
        //         if (req.body.recordame) {
        //             const expirationDate = new Date('10 Jan 2025 00:00:00 PDT'); // Luego hacer dinamico
        //             req.session.cookie.expires = expirationDate;
        //         } else {
        //             req.session.cookie.expires = false;
        //         }
        //         return res.redirect('/home')
        //     } else {
        //         if (Object.keys(errors).length == 0) { //Si no esta vacio, queremos que tomen prioridad los otros errores!
        //             errors['password'] = {msg: '*Usuario o contraseña incorrectos'};
        //         }
        // }} else {
        //     if (Object.keys(errors).length == 0) {
        //     errors['password'] = {msg: '*Usuario o contraseña incorrectos'};
        //         }} 
        // let {email,password} = req.body;
        // return res.render('login', {errors: errors,oldData: {email,password}});
    },

    profile: async (req,res) => {
        let user = await db.Usuarios.findOne(
            {where: {id:req.session.idUsuario}}
        );
        let rol = await db.roles.findAll()
            .then(function(rol){

                return res.render('perfilUsuario',{usuarioActual:user, rol:rol})
            })
    //     await db.Usuarios.findAll()
    //         .then(function(registrados){
    //             usuarioActual = req.params.id;
    //             return res.render('perfilUsuario', {registrados:registrados, usuarioActual:usuarioActual})
    //         })
    },
    
    editar_usuarioView: async (req,res) => {

        if (req.session.idUsuario) {

            let usuarioAEditar = await db.Usuarios.findOne(
                {where: {id:req.session.idUsuario}}
            );
            
            res.render('editar_usuario', {usuarioAEditar:usuarioAEditar})

        } else {

            res.render('login')

        }

    },

    editar_usuarioProcess: (req,res) => {

        db.Usuarios.update({
            nombre: req.body.nombre,
            foto: req.body.foto,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        }, {
            where: {
                id: req.session.idUsuario
            }
        });
        
        res.redirect(`/perfil`); 
    },
    
    logout: (req,res) => {
        // delete req.session.userLoggedIn;
        req.session.destroy();
        res.redirect('home');
    }
}

module.exports = usersController;