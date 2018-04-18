const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')

const { todosSample,populateTodos,usersSample,populateUsers  } = require('./seed/seed')




beforeEach(populateTodos)
beforeEach(populateUsers)



describe('POST /todos', () => {



    
    it('should add a new todo', (done) => {
        var text = 'this is the test'
        request(app)
            .post('/todos')
            .set('x-auth', usersSample[0].tokens[0].token)
            .send( {text, _creator: usersSample[0]._id})
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
        request(app).post('/todos')
        .set('x-auth', usersSample[0].tokens[0].token)
        .send({invalidText, _creator: usersSample[0]._id })
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


describe('GET /todos', () => {

    it('should get all to dos ', (done) => {
        request(app).get('/todos')
            .set('x-auth', usersSample[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1)
            })
            .end(done)
    })
})


describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todosSample[0]._id.toHexString()}`)
            .set('x-auth', usersSample[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todosSample[0].text)
            })
            .end(done)
    })

    it('should not return todo doc if doc created by other user', (done) => {
        request(app)
            .get(`/todos/${todosSample[1]._id.toHexString()}`)
            .set('x-auth', usersSample[0].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('should return 404 if todo not found', (done) => {
        var hid = new ObjectID().toHexString()
        request(app)
            .get(`/todos/${hid}`)
            .set('x-auth', usersSample[0].tokens[0].token)
            .expect(404)
            .end(done)

    })

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get('/todos/123')
        .set('x-auth', usersSample[0].tokens[0].token)
        .expect(404)
        .end(done)
    })
})


describe('DELETE /todos/:id', () => {
    it('should remove the todo', (done) => {
        var hexId = todosSample[1]._id.toHexString()

        request(app).delete(`/todos/${hexId}`)
            .set('x-auth', usersSample[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todosSample[1].text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                } 
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy()
                    done()
                }).catch((e) => done(e))
            })
            

    })

    it('should not remove the todo if not created by the current user', (done) => {
        var hexId = todosSample[1]._id.toHexString()

        request(app).delete(`/todos/${hexId}`)
            .set('x-auth', usersSample[0].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err)
                } 
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy()
                    done()
                }).catch((e) => done(e))
            })
            

    })

    it('should return 404 if todo not found', (done) => {
        var hid = new ObjectID().toHexString()
        request(app)
            .delete(`/todos/${hid}`)
            .set('x-auth', usersSample[0].tokens[0].token)
            .expect(404)
            .end(done)

    })

    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete('/todos/123')
        .set('x-auth', usersSample[0].tokens[0].token)
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
            .set('x-auth', usersSample[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.text).toBe(newtext)
                expect(typeof res.body.todo.completedAt).toBe('number')
            })
            .end(done)
        //update text, set completed true 
    
        //200
        //text is changed, completed is true, completed is a number. toBeA

    })

    it('should not update the todo if not created by the user', (done) => {
        //grab id of the first item
        var id = todosSample[0]._id
        var newtext  = 'test1'
        request(app).patch(`/todos/${id}`)
            .send({text: newtext, completed: true})
            .set('x-auth', usersSample[1].tokens[0].token)
            .expect(404)
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
            .set('x-auth', usersSample[1].tokens[0].token)
            .send({text: newtext, completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.text).toBe(newtext)
                expect(res.body.todo.completedAt).toBeFalsy()
            })
            .end(done)
        //update text, set completed false 
        //200
        //text is changed, completed is false, completed is null. toNotExist

    })
})

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app).get('users/me')
            .set('x-auth', usersSample[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(usersSample[0]._id.toHexString())
                expect(res.body.email).toBe(usersSample[0].email)
            })
            .end(() => done())
    })

    it('should return 401 if not authenticated', (done) => {
        request(app).get('users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(()=>done())
 
    })
})


describe('POST /users', () => {
    it('should create a user' , (done) => {
        var email = 'example@example.com'
        var password = '123mb!'

        request(app) 
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy()
                expect(res.body._id).toBeTruthy()
                expect(res.body.email).toBe(email)

            })
            .end((err) => {
                if(err) {
                    return done(err)
                }

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy()
                    expect(user.password).not.toBe(password)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should return validation errors if request invalid', (done) => {
        var email = 'example2@example.com'
        var password = '123m'

        request(app) 
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)


    })

    it('should not create user if email in use', (done) => {
        var email = usersSample[0].email
        var password = '123m!bb'

        request(app) 
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    })
})

describe('POST /users/login', () => {
    it('should login user and return auth token' , (done) => {
        request(app).post('/users/login')
            .send( {
                email: usersSample[1].email,
                password: usersSample[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy()
            })
            .end((err, res) => {
                if(err){
                    return done(err)
                }
                User.findById(usersSample[1]._id).then((user) => {
                    expect(user.toObject().tokens[1]).toMatchObject({
                        access:'auth',
                        token: res.headers['x-auth']
                    
                    })
                    done() 
                }).catch((e) => done(e))
                
            })
 
    })

    it('should reject invalid login', (done) => {
        request(app).post('/users/login')
            .send( {
                email: usersSample[1].email,
                password: 'wrongpass'
            })
            .expect(400)
            .end((err, res) => {
                if(err){
                    done(err)
                }
                User.findById(usersSample[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done() 
                }).catch((e) => done(e))
                
            })
    })
})


describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        //DELETE /users/me/token

        //Set x-auth equal to token
        //200
        //find user and verify the tokens array length is 0
        request(app).delete('/users/me/token')
            .set('x-auth', usersSample[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err) {
                    done(err)
                }
                User.findById(usersSample[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done() 
                }).catch((e) => done(e))
            })
    })
})