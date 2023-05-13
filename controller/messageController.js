const Message = require('../models/Message');

const getMessage = async (req, res) => {
  const { from, to } = req.body;
  const messages = await Message.find({
    users: {
      $all: [from, to],
    },
  }).sort({ updatedAt: 1 });

  const projectedMessages = messages.map((msg) => {
    return {
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    };
  });
  try {
    res.status(201).json(projectedMessages);
  } catch (error) {
    res.status(400).send(error);
  }
};

const addMessage = async (req, res) => {
  const { from, to, message } = req.body;
  const data = await Message.create({
    message: { text: message },
    users: [from, to],
    sender: from,
  });

  try {
    if (data)
      return res.status(201).json({ msg: 'Message added successfully' });
    else {
      return res.status(400).json({ msg: 'Failed to add message' });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { addMessage, getMessage };
