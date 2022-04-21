const fetch = require('node-fetch');
const userRepos = require("../repos/userReposForMongoDB.js");
const { ErrorHandler } = require("../middlewares/errorHandler");

module.exports = function()  {  
    var myUserRepos = new userRepos();
     
    //#region Functions
    //Get a Random User and Push a User in Json File
    const GetandPostRandomUser = async function () {
        try {
            const user = fetch('https://randomuser.me/api/?inc=gender,name,location,email&noinfo', 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res =>{
                return res.json();
            })
            .then(json => { 
                //console.log(json.results[0]);
                myUserRepos.Post(json.results[0]);
            })
            //Wait for random data, because sometimes coming very slow 
            new Promise(user => setTimeout(user, 8000));
        } catch (err) {
            throw new ErrorHandler(204, `An error occurred while retrieving user information. ${err}`);      
        }
    }

    const LastUser = async function () {
        return await myUserRepos.LastUser();
    }
    //#endregion

    return {
        Get: async function (country) {
            let users = null;
            if(country==null || country==undefined || country!="last"){
                users = await myUserRepos.Get(country??undefined);
            }
            else{
                users = await myUserRepos.LastUser();
            }
            if(users==null || users==undefined){
                console.log("Kayıt yok" + users)
            }

            return users;
        },
        GetCountriesOfUsers: async function () {
            return await myUserRepos.GetCountriesOfUsers();
        },
        Post: async function() {
            GetandPostRandomUser();
        },
        LastUser
    };
  };


