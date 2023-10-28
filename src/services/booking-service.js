const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { BookingRepository } = require('../repositories');
const { ServerConfig } = require('../config');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const serverConfig = require('../config/server-config');

const bookingRepository= new BookingRepository();

async function createBooking(data) {
   const transaction = await db.sequelize.transaction();

   try {

      const flight = await axios.get(`${ServerConfig.Flight_Service}/api/v1/flights/${data.flightId}`);
      const flightData = flight.data.data;
      if (data.noOfSeats > flightData.totalSeat) {
         throw new AppError('Not enough seat available', StatusCodes.BAD_REQUEST);
      }
      const totalBillingAmt= data.noOfSeats * flightData.price;
      const bookingPayloda={...data, totalCost:totalBillingAmt};
      const booking = await bookingRepository.createBooking(bookingPayloda,  transaction);

      await axios.patch(`${serverConfig.Flight_Service}/api/v1/flights/${data.flightId}/seats`,{
         seats:data.noOfSeats
      })
      
      await transaction.commit();
      return booking;
   } catch (error) {
     
      await transaction.rollback();
      throw error
   }
}


module.exports = {
   createBooking,
}