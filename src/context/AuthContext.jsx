import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'UPDATE_TENANT':
      return {
        ...state,
        user: {
          ...state.user,
          tenant: { ...state.user.tenant, ...action.payload }
        }
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { token, user: userData }
          });
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: { token: null, user: null } });
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await authService.login(email, password);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token: response.token, user: response.user }
      });

      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateTenant = (tenantData) => {
    dispatch({ type: 'UPDATE_TENANT', payload: tenantData });

    const updatedUser = {
      ...state.user,
      tenant: { ...state.user.tenant, ...tenantData }
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    ...state,
    login,
    logout,
    updateTenant,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
