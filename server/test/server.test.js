const expect = require('expect')
const request = require('supertest')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')


var todosSample = [{
    text: "first todo"
}, {
    text: "second todo"
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