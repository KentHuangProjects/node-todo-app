// const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
    if(err) {
        return console.log('Unable to connect MongoDB server.')
    }
    
    console.log('Connect to MongoDB server.')

    db.collection("Todos").findOneAndUpdate(
        { 
            _id : new ObjectID("5acc75e4d6b13f47752154e6") 
        },
        { 
            $set: {completed: true} 
        },
        {
            returnNewDocument: true
        }
    ).then((result)=>{
        console.log(result)
    })

    db.close();
})



 