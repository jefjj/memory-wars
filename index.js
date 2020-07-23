var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.use('/', express.static('dist'));

app.listen(port, function () {
    console.log(`server started port: ${port}`);
});
