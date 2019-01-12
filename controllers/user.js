'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');//sistema de ficheros
var path = require('path');

function pruebas(req, res){
    res.status(200).send({
        message:'Probando contoller User'
    });

}

function saveUser(req,res){
    var user = new User();
    var params = req.body;

    

    console.log(params);
    
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        //encriptar contraseña
        bcrypt.hash(params.password,null,null,function(err, hash){
            user.password=hash;
            if(user.name!= null && user.surname != null && user.email != null){
                //save user
                user.save((err,userStored) => {
                    if(err){
                        res.status(500).send({message: 'error al guardar el user'});
                    }
                    else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha registrado el user'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                })
            }else{
                res.status(200).send({message: 'rellena todos los campos'});
            }
        } );
    }else {
        res.status(500).send({message: 'Introduce contraseña'});
    }
}

function loginUser(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase()}, (err,user) =>{
            if(err){
                res.status(500).send({message: 'Error en la peticion'});  
            }else{
                if(!user){
                    res.status(404).send({message: 'user no existe'});
                }else{
                    bcrypt.compare(password,user.password, function(err, check){
                        if(check){
                            //devuelve los datos del user logeado
                            if(params.gethash){
                                //devolver token de jwt
                                res.status(200).send({
                                   token: jwt.createToken(user)
                                });

                            }else{
                                res.status(200).send({user});
                            }
                        }else{
                            res.status(404).send({message: 'cotraseña incorrecta'});
                        }
                    });

                }
            }
    
    });


}
function updateUser(req, res){
    var userId= req.params.id;
    var update= req.body;

    if(userId != req.user.sub){
       return res.status(500).send({message: 'No tienes permiso para actualizar este user'});
        
    }
    User.findByIdAndUpdate(userId, update, (err, userUpdate)=>{
        if(err){
            res.status(500).send({message: 'Error al Actualizar user'});
            
        }else{
            if(!userUpdate){
                res.status(404).send({message: 'No se ha podido actualizar user'});
                
            }else{
                res.status(200).send({user: userUpdate});
                
            }
        }
    });
}

function uploadImage(req, res){
    var userId= req.params.id;
    var file_name= 'No subido men :( ';

    if(req.files){
        var file_path = req.files.image.path;
        //recortar nombre fichero por las \
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];
        if(file_ext == 'png' ||file_ext == 'jpeg'||file_ext == 'gif' ){
            User.findByIdAndUpdate(userId,{image: file_name}, (err, userUpdate)=>{
                if(!userUpdate){
                    res.status(404).send({message: 'No se ha podido actualizar user'});
                    
                }else{
                    res.status(200).send({
                        image: file_name,
                        user: userUpdate});
                    
                }
            });
        }else{
            res.status(200).send({message: 'Extension no permitida'});
            
        }


        console.log(ext_split);

    }else{
        res.status(404).send({message: 'No has subido ninguna imagen .. '});
        
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;
    fs.exists(path_file, function(exists){     
        if(exists){
            res.sendFile(path.resolve(path_file));

        }else{
            res.status(200).send({message: 'No existe la Imagen'});
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};