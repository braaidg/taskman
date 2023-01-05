import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import { generateJWT, decodeJWT } from "../helpers/generateJWT.js";
import {
  sendRegisteredEmail,
  sendForgotPasswordEmail,
} from "../helpers/email.js";

const googleLogin = async (req, res) => {
  const { credential } = req.body;
  const googleUserInfo = await decodeJWT(credential);

  const existingUser = await User.findOne({ email: googleUserInfo.email });

  if (!existingUser) {
    const newUser = await User.create({
      name: googleUserInfo.name,
      email: googleUserInfo.email,
      password: googleUserInfo.jti,
    });
    return res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateJWT(newUser._id),
    });
  } else {
    return res.status(200).json({
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      token: generateJWT(existingUser._id),
    });
  }
};

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
    await user.save();

    sendRegisteredEmail({
      email: user.email,
      name: user.name,
      token: user.token,
    });

    res.json({
      msg: "User created successfully, check your email to confirm your account",
    });
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
    res.json({ msg: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generateId();
    await user.save();
    sendForgotPasswordEmail({
      email: user.email,
      name: user.name,
      token: user.token,
    });
    res.json({ msg: "We sent you an email with instructions" });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;

  const dbUserFromToken = await User.findOne({ token });

  if (dbUserFromToken) {
    res.json({ msg: "Token valid and user exist" });
  } else {
    const error = new Error("Token is not valid");
    return res.status(404).json({ msg: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const dbUserFromToken = await User.findOne({ token });

  if (dbUserFromToken) {
    dbUserFromToken.password = password;
    dbUserFromToken.token = "";
    try {
      await dbUserFromToken.save();
      res.json({ msg: "Password successfully modified" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token is not valid");
    return res.status(404).json({ msg: error.message });
  }
};

const profile = async (req, res) => {
  const { user } = req;
  res.json(user);
};

export {
  register,
  authenticate,
  confirmAccount,
  forgotPassword,
  checkToken,
  newPassword,
  profile,
  googleLogin,
};
