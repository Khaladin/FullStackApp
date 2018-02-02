var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {Todo};
