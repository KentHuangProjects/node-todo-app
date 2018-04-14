const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')


const bcrypt = require('bcryptjs')



var password = '123abc!'

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash)
    })
})

var hashedpassword = "$2a$10$Tuzzwg4qO2WWOL7GAxGq3u24fjVFO964Y2y6Q3tmUhhbgtSzmabam"

bcrypt.compare(password, hashedpassword, (err, res) => {
    console.log(res)
})


// var data = {
//     id : 10
// }

// var token = jwt.sign(data, '123abccc')
// console.log(token)

// var decoded = jwt.verify(token, '123abccc')
// console.log('decoded: ', decoded )

// var message = "I am user number 3"
// var hash = SHA256(message).toString()


// console.log('message:', message)
// console.log('hash:', hash)