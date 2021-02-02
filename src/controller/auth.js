import jwt from "jsonwebtoken";

import User from "../model/user.js";
import bcrypt from "bcrypt";
import sortid from "shortid";

export const signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({
        message: "User already registered",
      });
    } else {
      const { firstName, lastName, username, email, password } = req.body;

      const hash_password = await bcrypt.hash(password, 10);

      const _user = new User({
        firstName,
        lastName,
        username: sortid.generate(),
        email,
        hash_password,
      });

      _user.save((error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Something went wrong",
          });
        }

        if (data) {
          return res.status(201).json({
            message: "User created Successfully...!!",
          });
        }
      });
    }
  });
};

export const signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) res.status(400).json({ error });
    if (user) {
      const isPasswordValid = await user.authenticate(req.body.password);
      if (isPasswordValid && user.role === "user") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        const { _id, firstName, lastName, email, role, fullName } = user;

        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
          },
        });
      } else {
        res.status(400).json({
          message: "Something went wrong",
        });
      }
    } else {
      res.status(400).json({
        message: "User not exists",
      });
    }
  });
};
