const userDao = require("../daos/users-dao")

module.exports = (app) => {

    const register = (req, res) => {
        const credentials = req.body;
        userDao.findUserByUsername(credentials.username)
            .then((actualUser) => {
                if(actualUser) {
                    res.send("0")
                } else {
                    userDao.createUser(credentials)
                        .then((newUser) => {
                            req.session['profile'] = newUser;
                            res.json(newUser)
                        })
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
                    res.send("0")
                }
            })
    }
    
    const profile = (req, res) => {
        if(req.session["profile"]){
            res.send(req.session["profile"])
        } else {
            res.send("0")
        }
    }

    const findUserByName = (req, res) => {
       userDao.findUserByUsername(req.params.name)
         .then((actualUser) => {
            if(actualUser) {
                res.send(actualUser)
            } else {
                res.send("0")
            }
         });
    }

    const logout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    }

    const resetPassword = (req, res) => {
        const currentUser = req.session['profile'];
        const updatedUser = {
            ...currentUser,
            password: req.body['newPassword']
        };
        userDao.updateUser(currentUser._id, updatedUser)
            .then((updateStatus) => res.send(updateStatus));
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
    
    app.post("/api/users/profile", profile);
    app.post("/api/users/register", register);
    app.post("/api/users/login", login);
    app.get("/api/users/:name", findUserByName);
    app.get('/api/users', findAllUsers);
    app.post("/api/users/logout", logout);
    app.post("/api/users/reset", resetPassword);
    app.put("/api/users/update-role", updateUserRole);
}