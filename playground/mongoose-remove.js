const { ObjectID } = require('mongodb')
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo')


// Todo.remove({}) multiple 
Todo.remove({}).then((result) => {
    console.log(result)
})

// Todo.findOneAndRemove

Todo.findOneAndRemove({_id:'asdf'}).then((todo) => {
    console.log(todo)
})


// Todo.findByIdAndRemove

Todo.findByIdAndRemove('asdf').then((todo) => {
    console.log(todo)
})