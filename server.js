const express = require('express'); 
const cors = require('cors');
const request = require('request'); 
const app = express();
app.use(cors())


app.get('/search', function(req, res, query){ 
    request(`https://search-creativepassportmapsearch-xbszbelehmj4dl2w6prc2vt7mu.eu-west-1.cloudsearch.amazonaws.com/2013-01-01/search?q=`+ req.query.q, function (error, response, body) { 
      if (!error && response.statusCode === 200) { 
        console.log(req.query.q, body); 
        res.send(body); 
      } 
     }); 
  });

  app.listen(3005); 
console.log('Server running on port %d', 3005);


