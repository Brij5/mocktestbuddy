import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const generateToken = (userId, userRole, managedCategoryIds = []) => {
  const payload = {
    id: userId,
    role: userRole,
  };

  if (userRole === 'ExamManager' && managedCategoryIds && managedCategoryIds.length > 0) {
    payload.managedCategoryIds = managedCategoryIds;
  }

  return jwt.sign(
    payload,
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );
};

export default generateToken;