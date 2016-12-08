const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-promise');
const marked = require('marked');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const uuid = require('uuid-v4')
const globalToken = {};

const app = express();
app.use(bodyParser.json());
// app.use(function myMiddleware(req, res, next) {
//   console.log(req.method, req.path);
//   next();
// });
var accessLogStream = fs.createWriteStream('./data/access.log', {flags: 'a'});
app.use(morgan('tiny', {stream: accessLogStream}))

app.put('/documents/:filepath', function(req, res) {
  let filepath = './data/' + req.params.filepath;
  let contents = req.body.contents;
  fs.writeFile(filepath, contents, function(err) {
    .then(function() {
      res.json({ "message": 'file ', "filepath" : filepath})
    })
    .catch(function(err) {
      res.json({ "message": 'erra erra erra aye' + err.message });
    })
  })
})

app.put('/documents/:filepath', function(req, res) {
  let filepath = './data/' + req.params.filepath;
  let contents = req.body.contents;
  fs.writeFile(filepath, contents, function(err) {
    if (err) {
      res.json({ "message": 'erra erra erra aye' + err.message });
    } else {
      res.json({ "message": 'file ', "filepath" : filepath})
    }
  })
})

app.post('/api/login', function(req, res, next) {
  var username = req.body.username;
  var token = uuid();
  globalToken[token] = username;
  res.json({
    "token": token
  });
});

app.use(function auth(req, resp, next) {
  if (req.query.token in globalToken) {
    console.log("logged in")
    next()
  } else {
    resp.status(401);
    resp.json({error: 'token not recognized or something like that'})
  }
});

app.get('/documents/:filepath/display', function(req, res) {
  let filename = req.params.filepath;
  var file = './data/' + req.params.filepath;
  fs.readFile(file, function(err, buffer) {
    if (err) {
      res.json({ message: 'oops, this is why ' + err.message });
    } else {
      res.render('markdown.hbs', {
        title: filename,
        content: marked(buffer.toString())
      })
    }
  });
});

app.get('/documents', function(req, res) {
  fs.readdir('./data', function(err, files) {
    if (err) {
      res.json({message: 'oops' + err.message});
  } else {
      res.send(files);
    }
  });
});

app.listen(3000, function() {
  console.log('listening 3000')
})
