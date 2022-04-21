const express = require("express"); 
const { LoneAnonymousOperationRule } = require("graphql");
const router = express.Router();
const userServices = require("../services/userServices");
const { ErrorHandler } = require("../middlewares/errorHandler");

//#region Swagger proccess on controller
/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: string
 *       required:
 *         - country
 *       properties:
 *         country:
 *           type: string
 *           description: The country of User
 *       example:
 *         country : Norway
 */

/**
  * @swagger
  * tags:
  *   name: Country
  *   description: The country of users managing API
*/
//#endregion

//#region Endpoints
/**
 * @swagger
 * /country:
 *   get:
 *     summary: Returns all countries of users. When you use GraphQL then you don't need this endpoint.
 *     tags: [Country]
 *     responses:
 *       200:
 *         description: All countries of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *       500:
 *         description: Some server error
 */
router.get('/', async (req, res) => {
    try {
        var myUserServices = new userServices();
        const countries = await myUserServices.GetCountriesOfUsers(); 
        //waiting for answer 4 seconds. 
        new Promise(countries => setTimeout(countries, 4000));
        if(countries==null || countries==undefined){
            throw new ErrorHandler(404, "Country not found.");
        }
        res.send(countries);
    } catch (err) {
        throw new ErrorHandler(500, err);
    }
});
//#endregion

module.exports=router;


