const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    let { name, numOfPerson, address, contact } = req.body;

    if (!name || !numOfPerson || !address || !contact) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    contact = String(contact).trim();

    const exists = await User.exists({ contact });
    if (exists) {
      return res.status(409).json({ error: 'Entered mobile already in use' });
    }

    const newUser = await User.create({ name, numOfPerson, address, contact });
    return res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Entered mobile already in use' });
    }
    console.error('createUser:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error('getUser:', err);
    return res.status(400).json({ error: 'Invalid user id' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, numOfPerson, address, contact } = req.body ?? {};

    if (!name || !numOfPerson || !address) {
      return res
        .status(400)
        .json({ error: 'Name, Number of People and address are required' });
    }

    let update = { name, numOfPerson, address };
    if (typeof contact !== 'undefined') {
      const contactStr = String(contact).trim();
      const indianMobileRegex = /^[6-9]\d{9}$/;
      if (!indianMobileRegex.test(contactStr)) {
        return res.status(400).json({ error: 'Invalid mobile number' });
      }

      const dupe = await User.findOne({ contact: contactStr, _id: { $ne: id } });
      if (dupe) return res.status(409).json({ error: 'Entered mobile already in use' });

      update.contact = contactStr;
    }

    const updated = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: 'User not found' });

    return res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Entered mobile already in use' });
    }
    console.error('updateUser:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createUser, getUser, updateUser };
