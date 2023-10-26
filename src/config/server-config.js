const dotenv=require('dotenv');

dotenv.config();


module.exports={
    PORT:process.env.PORT || 8080,
    Flight_Service:process.env.Flight_Service
}