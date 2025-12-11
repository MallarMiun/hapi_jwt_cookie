const productController = require('../controllers/product.controller');
const Joi = require('joi')

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/products',
        handler: productController.getAllProducts,
        options: {
            auth: false
        }
    });

    server.route({
        method: 'GET',
        path: '/products/{id}',
        handler: productController.getProductById,
        options: {
            auth: false
        }
    });

    server.route({
        method: 'POST',
        path: '/products',
        handler: productController.createProduct,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(1).max(50),
                    price: Joi.number()
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/products/{id}',
        handler: productController.updateProduct
    });

    server.route({
        method: 'DELETE',
        path: '/products/{id}',
        handler: productController.deleteProduct
    });
};