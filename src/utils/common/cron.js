const cron = require('node-cron');

const { BookingService } = require('../../services')
function schedule(){
         
    cron.schedule("*/30 * * * * ", async () => {
        const response = await BookingService.cancelOldBookings();
      });
}


module.exports = schedule;