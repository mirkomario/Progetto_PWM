var express = require('express');
var Twitter = require('twitter');

var router = express.Router();
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  bearer_token: process.env.BEARER_TOKEN
});

router.get('/api/tweets/:screen_name',function(req,res,next){
    var params = { screen_name: req.params.screen_name,count:100};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      res.send(tweets);
    }else{
      res.send(error)
    }
  });
});

router.get('/api/user/:screen_name',function(req,res,next){
    var params = {screen_name: req.params.screen_name};
    client.get('users/show',params,function(error,tweets,response){
        if (!error) {
          res.send(tweets);
        }else{
          res.send(error);
        }
    })

});

module.exports = router;
