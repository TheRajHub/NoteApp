import { Router, Request, Response } from "express";
import jwtKey from "../utils/jwtkey";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
import mongoose from "mongoose";

const notes = Router();

notes.post("/add", async (req: Request, res: Response) => {
  let token = req.headers["authorization"]?.split(" ")[1];
  let { note, title } = req.body;

  if (!note || !title) {
    res.status(404).json({ error: "Fill up all fields" });
    return;
  }

  try {
    let payload = jwt.verify(token ?? "", jwtKey);
    const user = await User.findOne({ email: payload });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    ``;

    const newNote = { note, title };
    user.notes.push(newNote);
    await user.save();

    // get the last note added (MongoDB will assign _id)
    const addedNote = user.notes[user.notes.length - 1];

    res.status(200).json(addedNote._id.toString());
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
});

notes.delete("/delete/:id", async (req: Request, res: Response) => {
  let token = req.headers["authorization"]?.split(" ")[1];
  let noteId = req.params["id"];
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    res.status(400).json({ error: "Invalid note ID" });
    return;
  }
  let id = new mongoose.Types.ObjectId(noteId);
  if (!id) {
    res.status(404).json({ error: "Fill up all fields" });
    return;
  }
  try {
    let payload = jwt.verify(token ?? "", jwtKey);
    const user = await User.findOne({ email: payload });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    user.notes.pull({ _id: id });
    await user.save();

    res.status(200).json({ success: "Deleted" });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
});

export default notes;
