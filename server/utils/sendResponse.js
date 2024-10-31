// Function to send a response
module.exports.sendResponse = (res, status, success, message, data = {}) => {
  res.status(status).send({ success, message, ...data });
};
