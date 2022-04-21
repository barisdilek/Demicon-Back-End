const express = require("express");
const context = require("../db/mongoDBContext.js");
const { ErrorHandler } = require("../middlewares/errorHandler");

module.exports = function(){

    //#region Functions

    const RequiredModel = (user, addlocation=false) =>
    {
        
        if(addlocation)
        {
            return JSON.parse(`{
                "name": {\
                    "title": "${user?.name?.title}",\
                    "first": "${user?.name?.first}",\
                    "last": "${user?.name?.last}"\
                },\
                "gender":"${user?.gender}",\
                "email":"${user?.email}",\
                "location": {\
                    "street": "${user?.location?.street}",\
                    "city": "${user?.location?.city}",\
                    "state": "${user?.location?.state}",\
                    "country": "${user?.location?.country}",\
                    "postcode": "${user?.location?.postcode}",\
                    "coordinates": "${user?.location?.coordinates}",\
                    "timezone": "${user?.location?.timezone}"\    
                }\
            }`);
        }
        else
        {
            return JSON.parse(`{
                "name": { \
                    "title": "${user?.name?.title}",\
                    "first": "${user?.name?.first}",\
                    "last": "${user?.name?.last}"\
                },\
                "gender":"${user?.gender}",\
                "email":"${user?.email}"\
            }`);
        }
    }

    const LastUser = async function(){
        let user = null;
        try {
            await context.connect();
            // define a database and collection on which to run the method
            const database = context.db("UserApi");
            const users = database.collection("Users");

            // define an empty query document
            let query = {};

            const options = {
                // sort in descending (-1) order by rating
                sort : { _id: -1 },
                // omit the first two documents
                skip : 1,
                limit : 1
                }

            const projection = { 
                name: 1, 
                gender:1, 
                email:1,
                location:1, 
                //'location.country':1, 
                _id:0 };
            
            const cursor = users
                .find(query,options)
                .project(projection); 

            user = await cursor.toArray()
            
            //console.log(user);
        } 
        catch (err) {
            throw err;
        } 
        finally {
            await context.close();
        }
        if(user!=null && user!=undefined && user.length>0)
        {
            return RequiredModel(user[0],true);
        }
        return null;
    }

    //#endregion
    
    return {
        //Get User Method
        Get: async function (country) {
            let users = null;
            try {
                await context.connect();
                // define a database and collection on which to run the method
                const database = context.db("UserApi");
                const userDmos = database.collection("Users");
                
                const cursor = userDmos
                    .aggregate([
                        {
                            $group : { 
                                _id : "$location.country", 
                                users: { 
                                    $push: //"$$ROOT" 
                                    {
                                        name:"$name",
                                        gender:"$gender",
                                        email:"$email"
                                    }
                                } 
                            }
                        },
                        {
                            $sort : {_id: 1}
                        },
                        {
                            $match: country!=null && country!=undefined ?
                                {_id:{$eq: country}} : {}
                        },
                        {
                            $project: {
                                "name": "$_id",
                                users: 1,
                                "_id": 0
                            }
                        }
                    ])
                
                users = await cursor.toArray()
            } 
            catch (err) {
                throw err;
            } 
            finally {
                await context.close();
            }
            
            if(users!=null && users!=undefined && users.length==1)
            {
                return users[0];
            }
            return users;
        },
        //Get endpoint for countryController.
        //Get Countries of Users
        GetCountriesOfUsers: async function (){
            let distinctValues = null;
            try {
                await context.connect();
                // define a database and collection on which to run the method
                const database = context.db("UserApi");
                const users = database.collection("Users");
                // specify the document field
                const fieldName = "location.country";
    
                distinctValues = await users.distinct(fieldName);
            } 
            catch (err) {
                throw new ErrorHandler(500, err);  
                throw err;
            } 
            finally {
                await context.close();
            }
            return distinctValues;
        },
        Post : async function(user){
            const lastUser = await LastUser();
            //waiting for answer 4 seconds. 
            new Promise(lastUser => setTimeout(lastUser, 4000));
            try {
                if(user==null || user==undefined) throw lastUser;
                await context.connect();
                
                // define a database and collection on which to run the method
                const database = context.db("UserApi");
                const users = database.collection("Users");
                
                users.insertOne(user, function (err, result) {
                    if (err) throw err;
                    return 'Success';
                });
                //console.log(usersdasd);
            } 
            catch (err) {
                throw new ErrorHandler(400, `${lastUser} ${err}`);  
            } 
            finally {
                //await context.close();
            }
        },
        LastUser
    };
};

//distinct props
Array.prototype.unique = function(a){return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1) < 0});



