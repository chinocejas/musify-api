'use strict'

var mongoose = require('mongoose');
var app =require('./app.js');
var port = process.env.PORT || 3977;



mongoose.connect('mongodb://localhost:27017/curso_mean2' ,(err,res)=>{
    if(err){
        throw err;
    }else {
        console.log("La Base de Datos está conectada..")

        app.listen(port,  function(){
            console.log("Servidor apiRest is running on http://localhost:"+port);

        });
    }
});