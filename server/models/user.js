const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

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

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this

    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password,user.password, (err,res) =>{
                if(res) {
                    resolve(user)
                } else {
                    reject()
                }
            })

        })
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

UserSchema.pre('save', function(next) {
    var user = this
    if(user.isModified('password')) {
        var password = user.password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hashedPassword) => {
                user.password = hashedPassword
                next()
            })
        })

    } else {
        next()
    }
})



var User = mongoose.model('User', UserSchema)

module.exports = { User }