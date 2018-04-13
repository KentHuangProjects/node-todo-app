const { ObjectID } = require('mongodb')
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo')


var id = '5acf7bb1845d1ede35f82363'


// if(!ObjectID.isValid(id)) {
//     console.log('ID not valid')
// }

Todo.find({_id: id }).then((todos) => {
    console.log('Todos ', todos)
}).catch((e) => console.log(e))

Todo.findOne({_id: id}).then((todo) => {
    console.log('Todo ', todo)
}).catch((e) => console.log(e))

Todo.findById(id).then((todo) => {
    console.log('Todo by id', todo)
}).catch((e) => console.log(e))