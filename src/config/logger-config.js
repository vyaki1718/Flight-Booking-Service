const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, printf}=format;

const custformat=printf(({level, message, timestamp})=>{
  return `${timestamp}  : ${level} : ${message}`
})


const logger=createLogger({
    format:combine(
       
    timestamp({format: 'YYYY-MM-DD HH:MM:SS'}),
    custformat
    ), 
    transports:[
        new transports.Console(),
        new transports.File({filename:'combine-log'})
    ]
})


module.exports=logger;