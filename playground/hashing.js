const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')


var data = {
    id : 10
}

var token = jwt.sign(data, '123abccc')
console.log(token)

var decoded = jwt.verify(token, '123abccc')
console.log('decoded: ', decoded )

// var message = "I am user number 3"
// var hash = SHA256(message).toString()


// console.log('message:', message)
// console.log('hash:', hash)