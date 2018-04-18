const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const { Todo } = require('./../../models/todo')
const { User } = require('./../../models/user')



const todosSample = [{
    _id: new ObjectID(),
    text: "first todo"
}, {
    _id: new ObjectID(),
    text: "second todo",
    completed: true,
    completedAt: 123
}]

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const usersSample = [{
    _id: userOneId,
    email: 'kent@example.com',
    password: 'userOnePass',
    token: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId.toHexString(),access: 'auth'}, 'abc123').toString()
    }]
},{
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass'

}]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todosSample)
    }).then(() => done())
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var user1 = new User(usersSample[0]).save();
        var user2 = new User(usersSample[1]).save();
        
        return Promise.all(['user1', 'user2']);
    }).then(() => done())

}

module.exports= {
    todosSample,
    populateTodos,
    usersSample,
    populateUsers

}