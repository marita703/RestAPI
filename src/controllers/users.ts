import express from "express";
import { deleteUserById, getUserById, getUsers } from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log("Error from getAll Users", error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    return res.sendStatus(200).json(deletedUser);
  } catch (error) {
    console.log("Error from deleteUser", error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { userName } = req.body;

    if (!userName) {
      res.sendStatus(400);
    }

    const user = await getUserById(id);

    if (!user) {
      return res.sendStatus(404); // Use 404 if user is not found
    }

    user.userName = userName;

    await user.save();

    return res.sendStatus(200).json(user).end();
  } catch (error) {
    console.log("Error from updateUser", error);
    return res.sendStatus(400);
  }
};
