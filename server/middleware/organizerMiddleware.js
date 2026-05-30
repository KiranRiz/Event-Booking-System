// Middleware to restrict access to organizer only
const isOrganizer = (req, res, next) => {
  if (req.user && 
     (req.user.role === 'organizer' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      message: 'Access denied. Organizer only.'
    });
  }
};

module.exports = { isOrganizer };