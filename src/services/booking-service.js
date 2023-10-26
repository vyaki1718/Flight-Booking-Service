const axios= require('axios');
const {StatusCodes} = require('http-status-codes');
const {BookingRepository} = require('../repositories');
const {ServerConfig}= require('../config');
const db = require('../models');
const AppError= require('../utils/errors/app-error')

async function createBooking(data){
    
      return new Promise((resolve,reject)=>{
        const result = db.sequelize.transaction(async function booking(t){
           const flight= await axios.get(`${ServerConfig.Flight_Service}/api/v1/flights/${data.flightId}`);
           const flightData= flight.data.data;
           if(data.noOfSeats > flightData.totalSeat){
              reject(new AppError('Not enough seat available', StatusCodes.BAD_REQUEST));
           }
           resolve(true)
        })
    })
}


module.exports={
  createBooking,
}