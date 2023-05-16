//Here is the root route that you can find at 'http://localhost:4444/'
//To test if the server is well-launched

const express = require('express');
const router = express.Router();

//Get request
router.get('/', async (req, res) => {
    res.status(200).send("<h1>Welcome on EpyTodo Api server</h1>");
})

module.exports = router;