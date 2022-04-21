const jsonContext = require("../db/lowDBContext");

module.exports = async function(app){

    //#region Functions

    const RequiredModel = (user) =>
    {
        const data = `{"name": { \
            "title": "${user?.name?.title}",\
            "first": "${user?.name?.first}",\
            "last": "${user?.name?.last}"},\
            "gender":"${user?.gender}",\
            "email":"${user?.email}"\
        }`;
        return JSON.parse(data);
    }

    //#endregion
    
    return {
        //Get User Method
        Get: async function (country) {
            const countries = app.db
            .get("Users")
            .filter(x=> country!=null && country!=undefined ? x.location.country == country : true)
            .groupBy(x => x.location.country)
            .map((vals,key) => { 
                return {name: key, users: vals.map(x=>RequiredModel(x))}
            })
            
            if (countries!=null &&
                countries.has("Users") && 
                countries.length == 1) {
                return countries[0]
            }

            return countries.value();
        },
        //For get endpoint of countryController.
        //Get Countries of Users
        GetCountriesOfUsers: async function () {
            const countries = app.db
            .get('Users')
            .map((x)=>x.location.country)
            .value()
            .unique()
            .sort();
        
            return countries;
        },
        Post : async function(user){
            if(user==null || user==undefined)
            {
                throw LastUser;
            }
            else{
                app.db.get('Users').push(user).write();
                LastUser = RequiredModel(user);
            }
        },
        LastUser: async function(user){
            return RequiredModel(app.db.get('Users').pop().value());
        },
    };
};

//distinct props
Array.prototype.unique = function(a){return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1) < 0});



