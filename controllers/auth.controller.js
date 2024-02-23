const { dbConfig } = require('../configs');
const supabase = dbConfig.supabase;

// const { tokenUtil } = require('../utils');
const { userValidator } = require('../validators');


// Controller to register new users
const signUp = async (req, res) => {

  // Get validated payload data from request object
  const userData = req.regData;

  const { data, error } = await supabase.auth.signUp(
    {
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.last_name
        }
      }
    }
  )

  if (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while trying to add the user!"
    });
  }

  // On success return response to the user
  return res.status(200).send({
    success: true,
    data: data,
    message: "User was registered successfully!"
  });
};

// Controller to log in user into the system
const signIn = async (req, res) => {
  // Get user data from request body
  const payload = req.body;

  try {
    const validatedData = await userValidator.loginValidation(payload);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password
    })


    if (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while trying to login the user!"
      });
    }

    // On success return response to the user
    return res.status(200).send({
      success: true,
      data: data,
      message: "Login was successful!"
    });

  }
  catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  signUp, signIn
}