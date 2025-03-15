import pkg from "express";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const { Request, Response } = pkg;
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GithubStrategy = require("passport-github").Strategy;

const jwt_secret = process.env.JWT_SECRET || "defaultSecret";

export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ userId, name, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ userId: newUser.userId }, jwt_secret, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    console.error("[UserController] Error during registration: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      { userId: user.userId, email, role: user.role },
      jwt_secret,
      { expiresIn: "1hr" }
    );
    res.status(200).json({ message: "User Logged in successfully" });
  } catch (error) {
    console.error("[UserController] Error during login: ", error);
    res.status(500).json({ message: "Internal server" });
  }
};
