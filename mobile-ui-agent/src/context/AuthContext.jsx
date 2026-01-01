import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false
      };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  console.log(' AuthProvider initializing...');
  const [state, dispatch] = useReducer(authReducer, initialState);
  console.log(' AuthProvider state:', state);

  useEffect(() => {
    console.log(' AuthProvider useEffect running...');
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    console.log(' Token from localStorage:', token ? 'exists' : 'none');
    console.log(' User from localStorage:', user ? 'exists' : 'none');

    if (token && user) {
      // Check if token has expired
      if (tokenExpiration) {
        const expirationDate = new Date(tokenExpiration);
        const now = new Date();
        
        if (now > expirationDate) {
          console.log(' Token has expired, clearing session');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiration');
          localStorage.removeItem('rememberMe');
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
      }

      try {
        const parsedUser = JSON.parse(user);
        console.log(' AuthContext: Restoring user session:', parsedUser);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: parsedUser, token }
        });
      } catch (error) {
        console.error(' AuthContext: Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('rememberMe');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      console.log(' No stored session, setting loading to false');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = (user, token, rememberMe = false) => {
    if (rememberMe) {
      // Set longer expiration for "Remember Me" (30 days)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    } else {
      // Set shorter expiration (1 day)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('rememberMe', rememberMe.toString());
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('rememberMe');
    dispatch({ type: 'LOGOUT' });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  };

  const value = {
    ...state,
    login,
    logout,
    setError,
    clearError,
    setLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
