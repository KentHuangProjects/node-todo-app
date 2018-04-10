// const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
    if(err) {
        return console.log('Unable to connect MongoDB server.')
    }
    
    console.log('Connect to MongoDB server.')

    // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    // db.collection('Todos').find().count().then((count) => {
    //     console.log('Todos');
    //     console.log(`Num is ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos count', err)
    // })


    db.collection('Users').find({name: 'kent'}).count().then((count) => {
        console.log('users');
        console.log("count is " , count);
    }, (err) => {
        console.log('Unable to fetch count', err)
    })

    db.close();
})



 