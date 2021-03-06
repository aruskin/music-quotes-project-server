const userDao = require('../daos/users-dao')

module.exports = (app) => {

    const register = (req, res) => {
        const credentials = req.body;
        userDao.findUserByUsername(credentials.username)
            .then((actualUser) => {
                if(actualUser) {
                    res.send('0')
                } else {
                    userDao.createUser(credentials)
                        .then((newUser) => {
                            req.session['profile'] = newUser;
                            res.json(newUser)
                        });
                }
            })
    }

    const login = (req, res) => {
        const credentials = req.body;
        userDao.findUserByCredentials(credentials)
            .then((actualUser) => {
                if(actualUser) {
                    req.session['profile'] = actualUser;
                    res.send(actualUser)
                } else {
                    res.send('0')
                }
            })
    }
    
    const profile = (req, res) =>
        res.json(req.session['profile']);

    const findUserByName = (req, res) => {
       userDao.findUserByUsername(req.params.name)
         .then((actualUser) => {
            if(actualUser) {
                res.send(actualUser)
            } else {
                res.send('0')
            }
         });
    }

    const logout = (req, res) => {
        res.send(req.session.destroy());
    }

    const resetPassword = (req, res) => {
        const currentUser = req.session['profile'];
        if(currentUser){
            const updatedUser = {
                ...currentUser,
                password: req.body['newPassword']};
                userDao.updateUser(updatedUser._id, updatedUser)
                     .then((updateStatus) => res.send(updateStatus));
        } else {
            res.send({error: 'Cannot update password if not logged in'})
        }
    }

    const findAllUsers = (req, res) =>
        userDao.findAllUsers()
            .then(users => res.json(users))

    async function updateUserRole(req, res){
        const currentUser = req.session['profile'];
        if(currentUser){
            if(currentUser.role === 'ADMIN'){
                const username = req.body.username;
                let targetUser = await userDao.findUserByUsername(username);
                targetUser.role = req.body.role;
                userDao.updateUser(targetUser._id, targetUser)
                    .then((updateStatus) => res.send(updateStatus));
            }
        } else {
            res.send({error: 'Insufficient permissions to update user roles'})
        }
    }
    
    app.post('/api/users/profile', profile);
    app.post('/api/users/register', register);
    app.post('/api/users/login', login);
    app.get('/api/users/:name', findUserByName);
    app.get('/api/users', findAllUsers);
    app.post('/api/users/logout', logout);
    app.put('/api/users/reset', resetPassword);
    app.put('/api/users/update-role', updateUserRole);
}