'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require("mongoose");
require("dotenv").config();
const auth = require('./auth'); // Importera auth-filen


const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:5173', 'https://www.thunderclient.com', 'http://127.0.0.1:5500', 'http://localhost:3000'], // Tillåta domäner
                credentials: true, // cookies skickas med
                maxAge: 86400,
                headers: ["Accept", "Content-Type", "Access-Control-Allow-Origin", "Authorization"]
            }
        }
    });

    //connect to Mongodb
    mongoose.connect(process.env.DATABASE).then(() => {
        console.log("Connected to MongoDb");
    }).catch((error) => {
        console.error("Error connecting to database: " + error);
    });

    // Register JWT auth strategy
    await auth.register(server);

    // Register routes
    require('./routes/product.routes')(server);
    require('./routes/user.routes')(server);


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();