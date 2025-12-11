const User = require('../models/user.model');
const Jwt = require('@hapi/jwt');
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.getAllUsers = async (request, h) => {
    try {
        const users = await User.find();
        return h.response(users).code(200);
    } catch (error) {
        return h.response(error).code(500); // Skicka ett objekt med felmeddelandet
    }
};

exports.getUserById = async (request, h) => {
    try {
        const user = await User.findById(request.params.id);
        return h.response(user).code(200);
    } catch (error) {
        return h.response(error).code(500);
    }
};

exports.createUser = async (request, h) => {
    try {
        const { password, firstname, lastname, email } = request.payload
        const hashedPassword = await bcrypt.hash(password, 10) //hasha lösenord

        const user = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        })


        console.log(user);

        const savedUser = await user.save();
        return h.response(savedUser).code(201);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

exports.updateUser = async (request, h) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(request.params.id, request.payload, { new: true });
        return h.response(updatedUser).code(200);
    } catch (error) {
        return h.response(error).code(500);
    }
};

exports.deleteUser = async (request, h) => {
    try {
        await User.findByIdAndDelete(request.params.id);
        return h.response().code(204);
    } catch (error) {
        return h.response(error).code(500);
    }
};

exports.loginUser = async (request, h) => {

    const { email, password } = request.payload;
    try {
        let user = await User.findOne({ email: email });

        //Kolla om användare existerar
        if (!user) {
            return h.response({ message: "Email or password is incorrect" }).code(401);
        }

        // Kontrollera korrekt lösenord
        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return h.response({ message: "Email or password is incorrect" }).code(401);
        }

        // hämta användare, exkludera lösenord från datan
        user = await User.findOne({ email: email }, { password: 0 });

        const token = generateToken(user); //generera token

        return h
            .response({ message: 'You are now logged in', user: { firstname: user.firstname, lastname: user.lastname, email: user.email }, token })
            .state('jwt', token) //skapa http-cookie

    } catch (error) {
        console.error(error); // Logga felet för felsökning
        return h.response({ message: error.message }).code(500); // Skicka ett objekt med felmeddelandet
    }
}

exports.validateUser = async (request, h) => {
    return h.response({message: "Valid user"})

    // För att validera JWT-token i header
    /*
    const authorization = request.headers.authorization;

    if (!authorization) {
        return h.response({ message: 'Authorization header is missing' }).code(401);
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return h.response({ message: 'Token is missing' }).code(401);
    }

    console.log('Token:', token);

    try {
        
        // Skapa en token-instans först
        const tokenObject = Jwt.token.decode(token);
        
        if (!tokenObject) {
            return h.response({ message: 'Invalid token format' }).code(401);
        }
        
        // Verifiera token
        Jwt.token.verify(tokenObject, {
            key: process.env.JWT_SECRET_KEY,
            algorithms: ['HS256']
        });
        
        // Om ingen exception kastades är token verifierad
        // Använd payloaden från den decodade token
        const decodedToken = tokenObject.decoded.payload;
        console.log('Decoded token:', decodedToken);

        const user = await User.findById(decodedToken.user._id, { password: 0 });

        if (!user) {
            return h.response({ message: 'User not found' }).code(404);
        }

        return h.response({user: user}).code(200);

        
    } catch (error) {
        console.error('JWT verification error:', error);
        return h.response({ message: 'Invalid token' }).code(401);
    }*/
};

    exports.logoutUser = async (request, h) => {
        try {
            // Förstör eller nollställ cookien
            h.unstate('jwt'); // 
    
            return h.response({ message: 'Logged out successfully' }).code(200);
        } catch (error) {
            return h.response({ error: 'Failed to log out' }).code(500);
        }
    };


const generateToken = (user) => {
    const token = Jwt.token.generate(
        { user },
        { key: process.env.JWT_SECRET_KEY, algorithm: 'HS256' },
        { ttlSec: 24 * 60 * 60 * 1000 } // 24 hours
    );
    return token;
}

