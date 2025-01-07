const Product = require('../models/product.model');

exports.getAllProducts = async (request, h) => {
    try {
        const products = await Product.find();
        return h.response(products).code(200);
    } catch (error) {
        return h.response(error).code(500); // Skicka ett objekt med felmeddelandet
    }
};

exports.getProductById = async (request, h) => {
    try {
        const product = await Product.findById(request.params.id);
        return h.response(product).code(200);
    } catch (error) {
        return h.response(error).code(500);
    }
};

exports.createProduct = async (request, h) => {
    try {
        const product = new Product(request.payload);
        const savedProduct = await product.save();
        return h.response(savedProduct).code(201);
    } catch (error) {
        return h.response(error).code(500);
    }
};

exports.updateProduct = async (request, h) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(request.params.id, request.payload, { new: true });
        return h.response(updatedProduct).code(200);
    } catch (error) {
        return h.response(error).code(500);
    }
};

exports.deleteProduct = async (request, h) => {
    try {
        await Product.findByIdAndDelete(request.params.id);
        return h.response().code(204);
    } catch (error) {
        return h.response(error).code(500);
    }
};