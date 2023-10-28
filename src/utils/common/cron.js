const cron = require('node-cron');

const { BookingService } = require('../../services')
function schedule(){
         
    cron.schedule("*/30 * * * * ", async () => {
        console.log('running a task every minute');
        const response = await BookingService.cancelOldBookings();
        console.log(response);
      });
}


module.exports = schedule;