var express = require('express');
var router = express.Router();

var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'lYvQv8lR4atbMDdlB7ZxIuZue',
  consumer_secret: '2Fjqyhk4tP9W4AHgojOUEjfzyxtp1asEUQUwnxMaLrjfTtxLGT',
  access_token_key: '827147237851615233-ECXUSquo5kMzdNvixI0YDAoXGfXdzRg0',
  access_token_secret: 'O752dTmNMGd0fjLvSlhgt5BMBNf6hgo0VXNVbpQwEiAEl',
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAANxoGAEAAAAAXIs6tM3T%2Bjp%2BOO7KZfQeQv9Q9lY%3DFOpNe9Fk8MBMDofLPh4XaAEYV4glcAJTqKB3hKPTnAnkXEfyew'
});

var params = { user_id:'999578121123848192',count:100};



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/tweets',function(req,res,next){
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      res.send(tweets);
    }else{
      res.send(error)
    }
  });
});

router.get('/api/user',function(req,res,next){
    client.get('users/show',params,function(error,tweets,response){
        if (!error) {
          res.send(tweets);
        }else{
          res.send(error)
        }
    })

});

module.exports = router;
