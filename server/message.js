var moment = require('moment');

var message = (from, text)=>{
    return{
from,
text,
createdAt: moment().valueOf()
}
}

var Locmessage = (from, latitude, longitude)=>{
    return{
from,
url:`https://www.google.com/maps?q=${latitude},${longitude}`,
createdAt: moment().valueOf()
}
}
module.exports= {message, Locmessage};