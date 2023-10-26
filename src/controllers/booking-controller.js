const {StatusCodes}= require('http-status-codes');
const {BookingService} = require('../services');
const { ErrorResponse, SuccessResponse } = require("../utils/common");



async function createBooking(req,res){
    try {
        const booking = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId:req.body.userId,
            noOfSeats:req.body.noOfSeats
        });

        SuccessResponse.data = booking;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


module.exports={
    createBooking,
}