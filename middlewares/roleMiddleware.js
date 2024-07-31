module.exports = function(allowedRoles) {
    return function(req, res, next) {
      if (!req.isAuthenticated() || !req.user || !req.user.roles) {
        return res.redirect('/auth/login');
      }
  
      const userRoles = req.user.roles;
      const hasAccess = allowedRoles.some(role => userRoles.includes(role));
  
      if (hasAccess) {
        return next();
      } else {
        return res.status(403).send('Accès non autorisé');
      }
    };
  };
  