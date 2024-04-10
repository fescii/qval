// Importing from modules
const sequelize = require('sequelize');
const Op = sequelize.Op;

// Importing within the app
const { topicValidator } = require('../validators');
const { Topic } = require("../models").models;

const checkDuplicateTopic = async (req, res, next) => {
  // Get user data from request body
  const payload = req.body;
  
  try {
    const validatedData = await topicValidator.validateTopicData(payload);
    
    // Add the validated data to the request object for the next() function
    req.topic_data = validatedData;
    
    // Check if Topic slug or name is available using a single query
    try {
      const topic = await Topic.findOne({
        where: {
          [Op.or]: [
            {name: validatedData.name},
            {slug: validatedData.slug}
          ]
        }
      });
      
      // console.log(u);
      
      if (topic) {
        return res.status(409).send({
          success: false,
          topic,
          message: "Failed! topic with similar name or slug already exits!"
        });
      }
      
      // Call next function to proceed with data processing
      next();
    }
    catch (error) {
      return next(error);
    }
  }
  catch (error) {
    // console.log(error);
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
  
};

module.exports = {
  checkDuplicateTopic
};