const express = require("express"); 
const router = express.Router();
const jobServices = require("../services/jobServices");
const { ErrorHandler } = require("../middlewares/errorHandler");

//#region Swagger proccess on controller

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - timeInterval
 *       properties:
 *         timeInterval:
 *           type: string
 *           description: The time interval of Task
 *       example:
 *         timeInterval : "1"
 */

/**
  * @swagger
  * tags:
  *   name: Job
  *   description: Job events managing API
*/
//#endregion

//#region Endpoints
/**
 * @swagger
 * /job/{timeInterval}:
 *   post:
 *     summary: It set a time interval for Job. When you set a grow number  than zero then task run start by time interval.
 *     tags: [Job]
 *     parameters:
 *       - in: path
 *         name: timeInterval
 *         type: int
 *         required: true
 *         default : 1
 *         description: The time interval as minute
 *     responses:
 *       200:
 *         description: The Task will running
 *       500:
 *         description: Some server error
 */
router.post('/:timeInterval', async (req, res) => {
    try {
        var myJobServices = new jobServices();
        const message = await myJobServices.Start(req.params.timeInterval);
        res.status(200).send(message);
        //res.status(200).send("success");
    } catch (err) {
        throw new ErrorHandler(500, err);
    }
});

/**
 * @swagger
 * /job:
 *   delete:
 *     summary: It will terminate the previously started task.
 *     tags: [Job]
 *     responses:
 *       200:
 *         description: The Task stoped
 *       500:
 *         description: Some server error
 */
 router.delete('/', async (req, res) => {
    try {
        var myJobServices = new jobServices(req.Params);
        const message = await myJobServices.Stop();
        res.status(200).send(message);
    } catch (err) {
        throw new ErrorHandler(500, err);
    }
});
//#endregion

module.exports=router;


