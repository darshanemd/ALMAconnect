// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);
  
  // Set default status code to 500 if none is set on the response
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
