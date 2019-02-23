const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const config = require('./config');
const authenticate = require('./authenticate');


const User = require('./models/user');
const Api = require('./models/api');

mongoose.Promise = global.Promise;
mongoose.connect(
  config.mongoURL, {
    useNewUrlParser: true
  }
);
app.use(express.json())
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')))

app.post('/postmantest', (req, res) => {
  console.log("req",req);
  console.log("tester", req.body.tester);

  const testApi = new Api({
    tester: req.body.tester

  })
  testApi.save().then((rec => {
    res.status(200).json(rec)
  }))
})
app.post('/register', (req, res) => {
  const newUser = new User({
    name: req.body.fullName,
    email: req.body.email,
  })
  
  newUser.password = newUser.generateHash(req.body.password);
  newUser.save().then(rec => {
    res.status(201).json(rec)
  })
})

app.post('/login', (req, res) => {
  console.log("testeee",req.body.email);
  User.findOne({
    email: req.body.email
  }).then(loginUser => {
    if (!loginUser) {
      return res.status(401).json({
        message: 'Invalid username or password'
      })
    }
    if (!loginUser.validatePassword(req.body.password)) {
      return res.status(401).json({
        message: 'Invalid username or password'
      })
    }
    const withTokem = {
      email: loginUser.email,
      _id: loginUser._id
    };
    withTokem.token = loginUser.generateJWT();
    res.status(200).json(withTokem)
  })
})

app.get('/users', (req, res) => {
  User.find().then(rec => {
    res.status(200).json(rec)
  })
})





app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
});

app.listen(3030, () => console.log("Listening on port 3030..."));
