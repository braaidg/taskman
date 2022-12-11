import User from "../models/User.js";
import generateId from "../helpers/generateId.js";

const register = async (req, res) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    const error = new Error("User already registered");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = generateId();
    const userOnDb = await user.save();
    res.json(userOnDb);
  } catch (error) {
    console.log(error.message);
  }
};

export { register };
