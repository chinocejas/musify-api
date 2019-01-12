'use strict'

var express = require('express');
var ArtisController =require('../controllers/artist');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artists'});

api.get('/artist/:id', md_auth.ensureAuth, ArtisController.getArtist);

api.post('/artist', md_auth.ensureAuth, ArtisController.saveArtist);

api.get('/artists/:page?', md_auth.ensureAuth, ArtisController.getArtists);

api.put('/artist/:id', md_auth.ensureAuth, ArtisController.updateArtist);

api.delete('/artist/:id', md_auth.ensureAuth, ArtisController.deleteArtist);

api.post('/upload-image-artist/:id',[md_auth.ensureAuth, md_upload ], ArtisController.uploadImage);

api.get('/get-image-artist/:imageFile', ArtisController.getImageFile);



module.exports= api;