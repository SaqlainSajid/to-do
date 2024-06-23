const express = require("express");
const router = express.Router();
const Task = require("../models/task");

// //Get All
// //http://localhost:3000/doctors
// //error code 500 means, it's a server error
// router.get("/", async (req, res) => {
//   try {
//     const lists = await List.find({}).sort({ createdAt: 1 }).exec();
//     res.json(lists);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// //Create One
// //http://localhost:3000/doctors
// //code 201 means successful creation
// //code 400 means there's something wrong with the user input
// router.post("/", async (req, res) => {
//   const list = new List({
//     name: req.body.name,
//     tasks: [],
//   });

//   try {
//     const newList = await list.save();
//     res.json(newList);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// //Update One
// router.patch("/:id", async (req, res) => {
//   try {
//     const updatedDoctor = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedDoctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }
//     res.status(200).json(updatedDoctor);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: err.message });
//   }
// });

// //Delete One
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedDoctorId = await User.findByIdAndDelete(req.params.id);
//     if (!deletedDoctorId) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }
//     res.status(200).json({ _id: deletedDoctorId });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

module.exports = router;
