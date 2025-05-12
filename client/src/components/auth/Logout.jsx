import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice'; // Changed from logoutUser to logout

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout()); // Changed from logoutUser() to logout()
    navigate('/login', { replace: true });
  }, [dispatch, navigate]);

  // Render nothing, or a loading spinner if logout is async and you want to show feedback
  return null; 
};

export default Logout;
