const path = require('path');
const express = require('express');
const publicpath = path.join(__dirname,'../public');
var port = process.env.PORT || 3000;

const app = express();
app.use(express.static(publicpath));
app.listen(port,()=>{
    console.log(`server is on port${port}`);
});