'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
    var albumId = req.params.id;

    //Populate hace como un join con el id en la propiedad artist
    Album.findById(albumId).populate({path:'artist'}).exec((err, album)=>{
        if(err){
            res.status(500).send({message: 'Error al encontrar Album'});
        }else{
            if(!album){
            res.status(404).send({message: 'El album no existe'});
            }else{
                res.status(200).send({album});
            }
        
    }
    });


}

function saveAlbum(req,res){
    var album = new Album();
    var params = req.body;

    album.title= params.title;
    album.description = params.description;
    album.year = params.year;
    album.image='null';
    album.artist=params.artist;

    album.save((err,albumStored)=>{
        if(err){
            res.status(500).send({message: 'Error al guardar album'});
        }else{
            if(!albumStored){
            res.status(404).send({message: 'El album no ha sido guardado'});
            }else{
                res.status(200).send({album: albumStored});
            }
        
    }
});
}

function getAlbums(req,res){
    var artistId = req.params.artist;
    if(!artistId){
        //sacar todos los albums de la db
        var find = Album.find({}).sort('title');
    }else{
        var find = Album.find({artist:artistId}).sort('year');
    }

    find.populate({path:'artist'}).exec((err,albums)=>{
        if(err){
            res.status(500).send({message: 'Error al pedir album'});
        }else{
            if(!albums){
            res.status(404).send({message: 'No hay albums'});
            }else{
                res.status(200).send({albums});
            }
        
    }
    });

}

function updateAlbum(req,res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error al pedir album en el servidor'});
        }else{
            if(!albumUpdated){
            res.status(404).send({message: 'No hay album para actualizar'});
            }else{
                res.status(200).send({album: albumUpdated});
            }
        
    }
    });
}

function deleteAlbum(req,res){
    //recibe album Id por la URL
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId,(err, albumRemoved)=>{
              
                               if(err){
                                    res.status(500).send({message: 'Error en la peticion'});
                                    
                                }else{
                                    if(!albumRemoved){
                                        res.status(404).send({message: 'El album no ha sido eliminado'});
                                        
                                    }else{
            
                                        Song.find({album: albumId}).remove((err, songRemoved)=>{
                                            
                                                                if(err){
                                                                    res.status(500).send({message: 'Error en la peticion de las song'});
                                                                    
                                                                }else{
                                                                    if(!songRemoved){
                                                                        res.status(404).send({message: 'Las canciones no ha sido eliminado'});
                                                                        
                                                                    }else{
                                                                        res.status(200).send({
                                                                            album: albumRemoved
                                                                        });
                                                                    }
                                                                }
                                                            });
            
                                    }
                                }
                            });
    
}

function uploadImage(req,res){
    var albumtId = req.params.id;
    var file_name = 'no subido';

    if(req.files){
        var file_path = req.files.image.path;
        //recortar nombre fichero por las \
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];
        if(file_ext == 'png' ||file_ext == 'jpeg'||file_ext == 'gif' ||file_ext == 'jpg'){
            Album.findByIdAndUpdate(albumtId,{image: file_name}, (err, albumUpdate)=>{
                if(!albumUpdate){
                    res.status(404).send({message: 'No se ha podido actualizar artist'});
                    
                }else{
                    res.status(200).send({album: albumUpdate});
                    
                }
            });
        }else{
            res.status(200).send({message: 'Extension no permitida'});
            
        }


        

    }else{
        res.status(404).send({message: 'No has subido ninguna imagen .. '});
        
    }


}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    console.log(imageFile);
    var path_file = './uploads/album/'+imageFile;
    fs.exists(path_file, function(exists){     
        if(exists){
            res.sendFile(path.resolve(path_file));

        }else{
            res.status(200).send({message: 'No existe la Imagen'});
        }
    });
}



module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}