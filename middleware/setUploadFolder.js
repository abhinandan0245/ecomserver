module.exports = (folderName) => {
  return (req, res, next) => {
    req.uploadFolder = folderName;
    next();
  };
};
// This middleware sets the upload folder for the request, allowing dynamic folder paths to be used in file uploads. It can be used in routes to specify where uploaded files should be stored. The folder name is passed as an argument when the middleware is applied.
// Usage example in a route file: