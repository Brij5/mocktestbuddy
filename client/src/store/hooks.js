import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);
export const useShallowAppSelector = (selector) => useSelector(selector);