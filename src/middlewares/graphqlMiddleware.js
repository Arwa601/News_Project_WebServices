const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization || '';
    
    if (token !== 'votre-token-secret') {
      return res.status(403).send('Unauthorized');
    }
  
    next();
  };
  
  module.exports = authMiddleware;
  