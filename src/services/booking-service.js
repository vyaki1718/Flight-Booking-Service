const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { BookingRepository } = require('../repositories');
const { ServerConfig } = require('../config');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const serverConfig = require('../config/server-config');
const {Enums } = require('../utils/common');

const {BOOKED, CANCELLED} = Enums.BOOKING_STATUS;

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

async function makePayment(data){
   const transaction = await db.sequelize.transaction();
   try {
      const bookingDetails= await   bookingRepository.get(data.bookingId, transaction);

      if(bookingDetails.status == CANCELLED){
         throw new AppError("The booking ha expired!", StatusCodes.BAD_REQUEST)
      }
      const bookingTime = new Date(bookingDetails.createdAt);
      const currentTime = new Date();

      if(currentTime- bookingTime > 300000){
         // await bookingRepository.update(data.bookingId, {status: CANCELLED}, transaction);
         await cancelBooking(data.bookingId)
         throw new AppError("The booking ha expired!", StatusCodes.BAD_REQUEST)
      }
      if(bookingDetails.totalCost != data.totalCost){
         throw new AppError("The amount of payment doesn't match", StatusCodes.BAD_REQUEST)
      }
      if(bookingDetails.userId != data.userId ){
         throw new AppError("The user correspond to order  doesn't match", StatusCodes.BAD_REQUEST)
      }

      await bookingRepository.update(data.bookingId, {status: BOOKED}, transaction);
      
      await transaction.commit();
   } catch (error) {
      await transaction.rollback();
      throw error;
   }
}

async function cancelBooking(bookingId){
      const transaction = await db.sequelize.transaction();
      try {
         const bookingDetails= await   bookingRepository.get(bookingId, transaction);
         if(bookingDetails.status == CANCELLED){
            await transaction.commit();
            return true;
         }
         await axios.patch(`${serverConfig.Flight_Service}/api/v1/flights/${bookingDetails.flightId}/seats`,{
            seats:bookingDetails.noOfSeats,
            dec:0
         })
         await bookingRepository.update(bookingId, {status:CANCELLED}, transaction);
         await transaction.commit();
      } catch (error) {
         await transaction.rollback();
         throw error;
      }
}


module.exports = {
   createBooking,
   makePayment
}