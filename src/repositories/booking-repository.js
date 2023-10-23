const {StatusCodes} =require('http-status-codes');
const {Booking} =require('../models');
const CrudRepository = require('./crud-repository');

class BookinRepository extends CrudRepository{
    constructor (){
        super(Booking);
    }
}