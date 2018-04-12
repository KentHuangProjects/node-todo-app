const expect = require('expect')
const request = require('supertest')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')



describe('POST /todos', () => {


    beforeEach((done) => {
        Todo.remove({}).then(() => done() )
    })

    
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

                Todo.find().then((docs) => {
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
                    expect(todos.length).toBe(0)
                    done()
                }).catch((e) => done(e))


            })
    })
})