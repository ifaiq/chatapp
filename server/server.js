const path = require('path');
const express = require('express');
const publicpath = path.join(__dirname,'../public');

const app = express();
app.use(express.static(publicpath));
app.listen(3000);