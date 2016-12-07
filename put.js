const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const marked = require('marked');
const morgan = require('morgan');
const bcrypt = require('bcrypt');

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
    if (err) {
      res.json({ "message": 'sorry dude' + err.message });
    } else {
      res.json({ "message": 'file ', "filepath" : filepath})
    }
  })
})

function auth(req, resp, next) {
  if (req.query.token === token) {
    next()
  } else {
    res.status(401);
    res.jason({error: 'Login superfail lolz'})
  }
}
app.post('/api/login', function(req, res,next) {
  var username = req.body.username;
  var token = uuidV4()
  if (err) {
    res.json({ message: 'oops, this is why ' + err.message });
  } else {

  }
})
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
