const express = require('express');

const dbRouter= require('./data/db-router.js');

const server = express();

server.use('/api/posts', dbRouter);  //< < Creates the shortcut for use in db-router.js file

server.listen(5000, () => {
    console.log('\n*** Server Running on http://localhost:5000 ***\n');
})