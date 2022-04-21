const express = require("express"); 
const router = express.Router();
const userServices = require("../services/userServices");
const { ErrorHandler } = require("../middlewares/errorHandler");

//#region Functions
Get = async (req, res) =>{
    try {
        var myUserServices = new userServices();
        const users = await myUserServices.Get(req.params.country); 
        //waiting for answer 4 seconds. 
        new Promise(users => setTimeout(users, 4000));
        if(users==null || users==undefined){
            throw new ErrorHandler(404, `User not found`);
        }
        res.send(users);
    } catch (error) {
        throw new ErrorHandler(500, `Error during data getting : ${error}`);
    }
};
//#endregion

//#region Swagger proccess on controller

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - gender
 *         - email
 *       properties:
 *         name:
 *           type: object
 *           description: The name of User
 *         gender:
 *           type: string
 *           description: The gender of User
 *         email:
 *           type: string
 *           description: The email of User         
 *       example:
 *         name : object
 *         gender : male
 *         email : varg.winge@example.com 
 */

/**
  * @swagger
  * tags:
  *   name: User
  *   description: The users managing API
*/
//#endregion

//#region Endpoints
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get the users by countries
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The user description by country
 *         contens:
 *           application/json:
 *             type: array
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some server error
 */
 router.get('/', async (req, res) => {
    Get(req, res);
});

/**
 * @swagger
 * /user/{country}:
 *   get:
 *     summary: Get the users by country
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: country
 *         type: string
 *         required: true
 *         description: The country
 *     responses:
 *       200:
 *         description: The user description by country
 *         contens:
 *           application/json:
 *             type: array
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some server error
 */
router.get('/:country', async (req, res) => {
    Get(req, res);
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Get a random user and create a new user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *       500:
 *         description: Return data from the last successful synchronization
 *         contens:
 *           application/json:
 *             type: object
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/', async (req, res) => {
    try {
        var myUserServices = new userServices();
        await myUserServices.Post();
        res.status(200).send("The user was successfully created");
    } catch (error) {
        throw new ErrorHandler(500, `Error during data processing : ${error}`);
    }
});
//#endregion

module.exports=router;


