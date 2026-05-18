const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const seller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a seller' });
  }
};

const adminOrSeller = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'seller')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = { admin, seller, adminOrSeller };