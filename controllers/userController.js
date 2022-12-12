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

const authenticate = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  if (!user.confirmed) {
    const error = new Error("Your account is not confirmed");
    return res.status(404).json({ msg: error.message });
  }

  if (await user.checkPassword(password)) {
    res.json({ _id: user._id, name: user.name, email: user.email });
  } else {
    const error = new Error("Password doesn't match");
    return res.status(404).json({ msg: error.message });
  }
};

export { register, authenticate };
