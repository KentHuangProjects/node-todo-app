const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            },
            message: '{VALUE} is not a valid email.'
        }

    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    tokens:[{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.toJSON = function() {
    var user = this
    var useroj = user.toObject()

    return _.pick(useroj,['_id','email'])
}

UserSchema.methods.generateAuthToken = function() {
    var user = this
    var access = 'auth'
    var token =  jwt.sign({_id: user._id.toHexString(), access}, 'abc123')
    
    user.tokens = user.tokens.concat([{token,access}])
    return user.save().then(() => {
        return token
    })

}

UserSchema.statics.findByToken = function(token) {
    var User = this
    var decoded

    try{
        decoded = jwt.verify(token,'abc123')
    }catch(e) {
        return  Promise.reject()

    }

    return User.findOne({'_id': decoded._id, 
                        'tokens.access':'auth',
                        'tokens.token': token})
}

var User = mongoose.model('User', UserSchema)

module.exports = { User }