const Hostel = require("../models/Hostel");
const User = require("../models/user")
const addHostel = async (req, res) => {
  try {
    const {
      name,
      city,
      address,
      description,
      singleRoomPrice,
      sharedRoomPrice,
    } = req.body;

    const images = req.files
      ? req.files.map(
          (file) => `/uploads/hostels/${file.filename}`
        )
      : [];

    const newHostel = new Hostel({
      name,
      city,
      address,
      description,
      images,
      singleRoomPrice,
      sharedRoomPrice,
    });

    await newHostel.save();

    res.status(201).json({
      message: "Hostel added successfully",
      hostel: newHostel,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find().populate('subAdmin', 'name email');
    res.status(200).json(hostels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getHostelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hostel = await Hostel.findById(id).populate('subAdmin', 'name email');

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    res.status(200).json(hostel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      city,
      address,
      description,
      singleRoomPrice,
      sharedRoomPrice,
    } = req.body;

    const hostel = await Hostel.findById(id);

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    let images = hostel.images;

    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (file) => `/uploads/hostels/${file.filename}`
      );
    }

    const updatedHostel = await Hostel.findByIdAndUpdate(
      id,
      {
        name,
        city,
        address,
        description,
        images,
        singleRoomPrice,
        sharedRoomPrice,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Hostel updated successfully",
      hostel: updatedHostel,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteHostel = async (req, res) => {
  try {
    const { id } = req.params;
    await Hostel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Hostel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const assignSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { subAdminId } = req.body;

    const existingHostel = await Hostel.findOne({
      subAdmin: subAdminId
    });
    if (
      existingHostel &&
      existingHostel._id.toString() !== id
    ) {
      await Hostel.findByIdAndUpdate(
        existingHostel._id,
        {
          subAdmin: null
        }
      );
    }
    const updatedHostel = await Hostel.findByIdAndUpdate(
      id,
      {
        subAdmin: subAdminId
      },
      {
        new: true
      }
    ).populate("subAdmin", "name email");

    await User.findByIdAndUpdate(
      subAdminId,
      {
        hostel: id
      }
    );


    res.status(200).json({
      message: "Sub-admin assigned successfully",
      hostel: updatedHostel
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
const uploadHostelImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const hostel = await Hostel.findByIdAndUpdate(
      req.params.id,
      { $push: { images: imageUrl } },
      { new: true }
    );
    res.status(200).json({ message: "Image added", hostel });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addHostel, getAllHostels, getHostelById, updateHostel, deleteHostel, assignSubAdmin ,uploadHostelImage};