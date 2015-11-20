// user authorization helper
function requireUser(req, res, next) {
  if (req.session.user === req.params.id) {
    next();
  } else {
    res.json({ fail: true, authorizeFail: true, message: 'Not Authorized' });
  }
}

module.exports = {
  requireUser: requireUser
}
