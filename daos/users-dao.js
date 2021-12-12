const usersModel = require("../models/users/users-model")

const findAllUsers = () => {
    return usersModel.find()
        .select({"password": 0})
        .sort({"accountCreationDate": -1})
}

const findUserByUsername = (username) => {
    return usersModel.findOne({username}).
        select({"password": 0})
}

const findUserByCredentials = (credentials) => {
    return usersModel.findOne({
        username: credentials.username,
        password: credentials.password
    })
}

const findUserById = (id) => {
    return usersModel.findOne({_id: id}).
        select({"password": 0})
}

const createUser = (user) => {
    return usersModel.create(user)
}

const updateUser = (id, user) => {
    return usersModel.updateOne(
        {_id: id},
        {$set: user}
    )
}

module.exports = {
    findUserByUsername,
    findUserByCredentials,
    findUserById,
    createUser,
    updateUser,
    findAllUsers
}