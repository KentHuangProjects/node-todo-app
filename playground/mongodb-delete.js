// const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
    if(err) {
        return console.log('Unable to connect MongoDB server.')
    }
    
    console.log('Connect to MongoDB server.')

    //deleteMany
    // db.collection('Todos').deleteMany({text: "Eat lunch"}).then((result) => {
    //     return console.log(result);
    // })

    //deleteOne
    db.collection('Todos').deleteOne({text: "Eat lunch"}).then((result) => {
        return console.log(result);
    })

    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
        return console.log(result);
    })


    db.close();
})



 