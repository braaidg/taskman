import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJWT from "../helpers/generateJWT.js";

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
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id),
    });
  } else {
    const error = new Error("Password doesn't match");
    return res.status(404).json({ msg: error.message });
  }
};

const confirmAccount = async (req, res) => {
  const { token } = req.params;
  const dbUserToConfirm = await User.findOne({ token });
  if (!dbUserToConfirm) {
    const error = new Error("Token is not valid");
    return res.status(404).json({ msg: error.message });
  }

  try {
    dbUserToConfirm.confirmed = true;
    dbUserToConfirm.token = "";
    await dbUserToConfirm.save();
    res.json({ msg: "User successfully confirmed" });
  } catch (error) {
    console.log(error);
  }
};

export { register, authenticate, confirmAccount };
