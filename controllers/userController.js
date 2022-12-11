import User from "../models/User.js";

const register = async (req, res) => {
  const bodyData = req.body;
  try {
    const user = new User(bodyData);
    const userOnDb = await user.save();
    res.json(userOnDb);
  } catch (error) {
    console.log(error.message);
  }
};

export { register };
