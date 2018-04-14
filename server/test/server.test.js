const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')


var todosSample = [{
    _id: new ObjectID(),
    text: "first todo"
}, {
    _id: new ObjectID(),
    text: "second todo",
    completed: true,
    completedAt: 123
}]



beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todosSample)
    }).then(() => done())
})

describe('GET /todos', () => {

    it('should get all to dos ', (done) => {
        request(app).get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe('POST /todos', () => {



    
    it('should add a new todo', (done) => {
        var text = 'this is the test'

        request(app).post('/todos')
            .send( {text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                Todo.find({text}).then((docs) => {
                    expect(docs.length).toBe(1);
                    expect(docs[0].text).toBe(text);
                    done();
                }).catch((e) => done(e))
            })


        

    } )


    it('should not add a new to do with invalid body data', (done) => {
        var invalidText = ''
        request(app).post('/todos').send({invalidText})
            .expect(400)
            .end((err,res) => {
                if(err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e))


            })
    })
})


describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app).get(`/todos/${todosSample[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todosSample[0].text)
            })
            .end(done)
    })

    it('should return 404 if todo not found', (done) => {
        var hid = new ObjectID().toHexString()
        request(app)
            .get(`/todos/${hid}`)
            .expect(404)
            .end(done)

    })

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done)
    })
})


describe('DELETE /todos/:id', () => {
    it('should remove the todo', (done) => {
        var hexId = todosSample[1]._id.toHexString()

        request(app).delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todosSample[1].text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                } 
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist()
                    done()
                }).catch((e) => done(e))
            })
            

    })

    it('should return 404 if todo not found', (done) => {
        var hid = new ObjectID().toHexString()
        request(app)
            .delete(`/todos/${hid}`)
            .expect(404)
            .end(done)

    })

    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done)

    })
})


describe('PATCH /todos/:id', () => {

    it('should update the todo', (done) => {
        //grab id of the first item
        var id = todosSample[0]._id
        var newtext  = 'test1'
        request(app).patch(`/todos/${id}`)
            .send({text: newtext, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.text).toBe(newtext)
                expect(res.body.todo.completedAt).toBeA('number')
            })
            .end(done)
        //update text, set completed true 
    
        //200
        //text is changed, completed is true, completed is a number. toBeA

    })

    it('should clear completedAt when the todo is not completed' , (done) => {
        //grab id of the second item
        var id = todosSample[1]._id
        var newtext  = 'test2'
        request(app).patch(`/todos/${id}`)
            .send({text: newtext, completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.text).toBe(newtext)
                expect(res.body.todo.completedAt).toNotExist()
            })
            .end(done)
        //update text, set completed false 
        //200
        //text is changed, completed is false, completed is null. toNotExist

    })
})