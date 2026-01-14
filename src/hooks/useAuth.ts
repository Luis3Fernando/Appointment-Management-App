import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { setUserRole, logout as logoutAction } from '../redux/slices/authSlice';

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { role, isLoggedIn } = useAppSelector((state) => state.auth);
  const loginAsAdmin = () => {
    dispatch(setUserRole('admin'));
  };

  const loginAsUser = () => {
    dispatch(setUserRole('user'));
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    role,
    isLoggedIn,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    loginAsAdmin,
    loginAsUser,
    logout,
  };
};