const express = require("express");
const router = express.Router();

const {
  addHostel,
  getAllHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
  assignSubAdmin,
} = require("../controllers/hostelController");

router.post("/add" , addHostel);
router.get("/all" , getAllHostels);
router.get("/:id" , getHostelById);
router.put("/update/:id" , updateHostel);
router.delete("/:id" , deleteHostel);
router.put('/assign-subadmin/:id', assignSubAdmin);

module.exports = router;
