const express = require("express");
const route = express.Router();
const { body, validationResult } = require("express-validator");
const featchUser = require("../middleWire/fatchUser");
const Note = require("../model/Note");

route.get("/featchallnotes", featchUser, async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
    });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Oops! Some Intrnal Error Occured!");
  }
});

route.post(
  "/addnote",
  featchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body(
      "descriptions",
      "Enter a valid descriptions, atleast 3 character"
    ).isLength({ min: 3 }),
  ],
  async (req, res) => {
    const { title, descriptions } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newnotes = await Note.create({
        user: req.user.id,
        title: title,
        descriptions: descriptions,
      });
      let savednote = await newnotes.save();
      res.json(savednote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Oops! Some Intrnal Error Occured!");
    }
  }
);

route.put("/updatenot/:id", featchUser, async (req, res) => {
  try {
    const { title, descriptions } = req.body;
    let Newnote = {};
    if (title) {
      Newnote.title = title;
    }
    if (descriptions) {
      Newnote.descriptions = descriptions;
    }

    let note = await Note.findById(req.params.id);
    console.log(note);
    if (!note) {
      return res.status(404).send("No Found");
    }

    if (note.user.toString() == req.params.id) {
      return res.status(401).send("No Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: Newnote },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Oops! Some Intrnal Error Occured!");
  }
});

route.delete("/deletenote/:id", featchUser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    // console.log(note)
    if (!note) {
      return res.status(404).send("No Found");
    }

    if (note.user.toString() == req.params.id) {
      return res.status(401).send("No Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.json({ Success: "Note has been deleted successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Oops! Some Intrnal Error Occured!");
  }
});

module.exports = route;
