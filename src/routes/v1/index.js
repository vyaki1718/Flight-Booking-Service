const express =require('express');

const router=express.Router();
const {InfoController} =require('../../controllers');
const  booking = require('./booking');

router.get('/info', InfoController.info);

router.use('/booking', booking);



module.exports=router;