Goals
---------------------------------------------------------------------

- Develop a backend application in your prefered Language
- Connector periodically (JobTask) get data from <https://randomuser.me/api> and save
into cache or database. The periodic update can also be triggered by an outside
service.
- Required Data from <https://randomuser.me/api> - gender, name, location, email
- Documentation of API - <https://randomuser.me/documentation>
- Implement simple GET controller to get users

    (Responce - JSON (“countries”:
        [{
            “name”: <country>,
            users: [{
                “name”: <userName>,
                “gender”: <gender>,
                “email”: <email>
            }]
        }]
    ))

- In case of an unsuccessful synchronization attempt, the Connector should return
data from the last successful synchronization
The backend application should be designed to work within CloudNative (serverless,
kubernetes etc) environments.

Requirements
---------------------------------------------------------------------

When you want start/stop Job task with interval. You can run start/stop endpoints. The details are in swagger UI.

- Start the job task for a minute curl :

    curl -X 'POST' \
    'http://localhost:8888/job/1' \
    -H 'accept: */*' \
    -d ''

- Stop the task curl :

    curl -X 'DELETE' \
    'http://localhost:8888/job' \
    -H 'accept: */*'

Swagger
---------------------------------------------------------------------

Swagger UI Link : <http://localhost:8888/swagger>

You can seeing all endpoints in Swagger UI Link

![Swagger view](AllEndPoints.png?raw=true "Swagger view")

GraphQL
---------------------------------------------------------------------

- a User Query :
    {
        user (country:"Germany"){
            name
            users{
                name {
                    title
                    first
                    last
                }
                gender
                email
            }
        }
    }

- Users Query :

    {
        users{
            name
            users{
                name {
                    title
                    first
                    last
                }
                gender
                email
            }
        }
    }

- AllCountry Query :

    {
        countries
    }

    or

    {
        users{
            name
        }
    }

![graphQL view](graphQL.png?raw=true "graphQL view")

Deployment

---------------------------------------------------------------------

-

Result
---------------------------------------------------------------------

github : https://github.com/barisdilek/Demicon-Backend
