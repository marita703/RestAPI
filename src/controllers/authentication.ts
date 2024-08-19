import express from "express";

import { getUserByEmail, createUser } from "../db/users";
import { authentication, random } from "../helpers/index";

//This is the controler for Login

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (
      !user ||
      !user.authentication ||
      !user.authentication.salt ||
      !user.authentication.password
    ) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("Mar-Auth", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log("Error from login: ", error);
    return res.sendStatus(400);
  }
};

//This is the controler for register

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, userName } = req.body;

    if (!email || !password || !userName) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      userName,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log("error from register function: ", error);
    return res.sendStatus(400);
  }
};
