const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // Role can come from decoded JWT (req.userRole) or from full user object
    const role = req.userRole || (req.user && req.user.role);

    if (!req.userId || !role) {
      return res.status(401).json({ msg: 'Unauthorized: missing credentials' });
    }

    // Support single role or array of roles
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(role)) {
        return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
      }
    } else {
      if (role !== requiredRole) {
        return res.status(403).json({ msg: `Access denied for role: ${role}` });
      }
    }

    next();
  };
};

module.exports = roleMiddleware;
