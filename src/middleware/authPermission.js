const authPermission = (requiredRole) => {
    return (req, res, next) => {
      // Kiểm tra nếu req.user không tồn tại
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user information found." });
      }
  
      const userRole = req.user.role;
      
      if (userRole === requiredRole) {
        return next();
      }
  
      res.status(403).json({ message: "Forbidden: Admin access only." });
    };
  };
  
  module.exports = {
    authPermission,
  };
  