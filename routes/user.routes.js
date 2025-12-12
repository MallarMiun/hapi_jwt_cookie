const userController = require('../controllers/user.controller');
const Joi = require('joi')

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/users',
        handler: userController.getAllUsers,
    });

    server.route({
        method: 'GET',
        path: '/users/{id}',
        handler: userController.getUserById
    });

    server.route({
        method: 'GET',
        path: '/users/validate',
        handler: userController.validateUser
    });

    server.route({
        method: 'POST',
        path: '/users/login',
        handler: userController.loginUser,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().min(1),
                    password: Joi.string().min(1)
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
            }
        }
    });

    server.route({
        method: "GET",
        path: "/users/logout",
        handler: userController.logoutUser,
        options: {
            auth: false
        }
    })

    server.route({
        method: 'POST',
        path: '/users',
        handler: userController.createUser,
        options: {
            auth: false
        }
    });

    server.route({
        method: 'PUT',
        path: '/users/{id}',
        handler: userController.updateUser
    });

    server.route({
        method: 'DELETE',
        path: '/users/{id}',
        handler: userController.deleteUser
    });
};