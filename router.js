const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const {Todo} = require('./models/todo');

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
      content: req.body.content
    });

    todo.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.send(e);
    });
  });

  app.get('/todos', (req, res) => {
    Todo.find()
      .then((todos) => {
        res.send({todos});
      }, (e) => {
        res.status(402).send(e)
      });
  });
}
