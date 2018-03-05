const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const {ObjectID} = require('mongodb');
const {Todo} = require('./models/todo');
const mongoose = require('mongoose')

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({message: 'Super secret code is ABC123'});
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);

  app.post('/newpost', (req, res) => {
      var todo = new Todo({
        title: req.body.title,
        content: req.body.content,
        creator: req.body.email, // adjust this line
      });

      todo.save().then((doc) => {
        res.send(doc);
      }, (e) => {
        res.send(e);
      });
  });


  app.get('/todos', (req, res) => {
    Todo.find({})
      .then((todos) => {
        res.send({todos});
      }, (e) => {
        res.status(402).send(e)
      });
  });

  app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send('not valid objectID');
    }

    Todo.findOne({
      _id: id,
    }).then((todo) => {
        res.send({todo});
    }, (e) => {
      res.status(404).send(e.response)
    });
  });

  app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    Todo.findOneAndRemove({
      _id:id,
    }).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.status(200).send({todo});
    }).catch((e) => res.send(e));
  });
}
