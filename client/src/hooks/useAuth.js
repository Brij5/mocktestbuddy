import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import authService from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    const response = await authService.login(credentials);
    dispatch(login(response));
    return response;
  };

  const handleLogout = () => {
    // Clear local storage and dispatch logout action
    localStorage.removeItem('userInfo');
    dispatch({ type: 'auth/logout' });
  };

  return {
    loading,
    error,
    handleLogin,
    handleLogout
  };
};
