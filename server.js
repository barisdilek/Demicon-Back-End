const express = require("express");
// var http = require('http');
// var https = require('https');
const handleError = require("./api/middlewares/errorHandler").handleError;

let app = express();

//#region DB Proccess

// I will get up DBContext from up layer. 
// That's why I'm closing these lines. 
// Thus, I will not carry dbcontext with request.
// It will be a more accurate use to diversify both security and db options.

// const low = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");

// const adapter = new FileSync("./api/data/users.json");
// const db = low(adapter);

// db.defaults({ Users: [] }).write();

//app.db = db;

//#endregion

//#region Environments
const cors = require("cors");
const morgan = require("morgan");
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
//#endregion

//#region Swagger Proccess
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition : {
        openapi:"3.0.0",
        info: {
            title: "Library Random User API",
            version: "1.0.0",
            description: "A simple randomuser.me API"
        },
        servers:[
            {url: "http://localhost:8888"}
        ]
    },
    apis:["./api/controllers/*.js"]
}

const specs = swaggerJsDoc(swaggerOptions);
app.use("/swagger",swaggerUI.serve,swaggerUI.setup(specs));
//#endregion

//#region Routting

const userController = require('./api/controllers/userController.js');
const countryController = require('./api/controllers/countryController.js');
const jobController = require('./api/controllers/jobController.js');

app.use('/user', userController)
app.use('/country', countryController)
app.use('/job', jobController)

//#endregion

//#region GraphQL Proccess

const userRepos = require("./api/repos/userReposForMongoDB.js");
var myUserRepos = userRepos(); 

const graphqlHTTP = require('express-graphql').graphqlHTTP;
const buildSchema = require("graphql").buildSchema;

// GraphQL Schema
const gqlSchema = buildSchema(`
    type Query {
        user(country: String): UserByCountry
        users: [UserByCountry]
        countries: [String]
    }
    type UserByCountry {
        name : String
        users : [User]
    }
    type User {
        name : UserName
        gender: String
        email: String
    }
    type UserName {
        title : String
        first : String
        last : String
    }
`); 

// Resolver
const gqlRoot = {
    user: async ({country}) => {return await myUserRepos.Get(country);},
    users: async () => {return await myUserRepos.Get();},
    countries: async () => {return await myUserRepos.GetCountriesOfUsers();} 
};

// GraphQL Options
const graphqlOptions = {
    schema: gqlSchema,
    rootValue: gqlRoot,
    graphiql: true,
}

// GraphQL middleware
app.use(
    "/graphql",
    graphqlHTTP(graphqlOptions)
);

//#endregion

// add custom error handler middleware as the last middleware
app.use((err, req, res, next) => {
    handleError(err, req, res, next);
});

const PORT = process.env.PORT || 8888;

// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(null, app);

// httpServer.listen(PORT,() => {
//     console.log(`The server is running on http:localhost:${PORT}`)
//     console.log(`Swagger : http:localhost:${PORT}\\swagger`)
//     console.log(`Graphql : http:localhost:${PORT}\\graphql`)
//     console.log(`Get All User http Request  : http:localhost:${PORT}\\user`) 
//     console.log(`Get a User http Request  : http:localhost:${PORT}\\user\\Germany`)      
// });
// const PORTs = PORT+1000;
// httpsServer.listen(PORTs,() => {
//     console.log(`The server is running on https:localhost:${PORTs}`)
//     console.log(`Swagger : https:localhost:${PORTs}\\swagger`)
//     console.log(`Graphql : https:localhost:${PORTs}\\graphql`)
//     console.log(`Get All User https Request  : https:localhost:${PORTs}\\user`) 
//     console.log(`Get a User http Request  : https:localhost:${PORTs}\\user\\Germany`)      
// });

app.listen(PORT,() => {
    console.log(`The server is running on http:localhost:${PORT}`)
    console.log(`Swagger : http:localhost:${PORT}\\swagger`)
    console.log(`Graphql : http:localhost:${PORT}\\graphql`)
    console.log(`Get All User http Request  : http:localhost:${PORT}\\user`) 
    console.log(`Get a User http Request  : http:localhost:${PORT}\\user\\Germany`)      
});





