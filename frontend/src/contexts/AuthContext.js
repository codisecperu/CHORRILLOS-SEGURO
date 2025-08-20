import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: null, // 'public', 'authorized', 'admin'
  token: null
};

// Tipos de acciones
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer para manejar el estado
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        role: action.payload.user.role,
        token: action.payload.token,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        token: null,
        error: action.payload
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        token: null,
        error: null
      };
    
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        role: action.payload.user.role,
        token: action.payload.token,
        error: null
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    default:
      return state;
  }
};

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Función de login
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      // Simulación de API call - aquí iría la llamada real al backend
      const response = await mockLoginAPI(email, password);
      
      if (response.success) {
        // Guardar en localStorage
        localStorage.setItem('chorrillos_token', response.token);
        localStorage.setItem('chorrillos_user', JSON.stringify(response.user));
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: response
        });
        
        return { success: true };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      // Simulación de API call
      const response = await mockRegisterAPI(userData);
      
      if (response.success) {
        localStorage.setItem('chorrillos_token', response.token);
        localStorage.setItem('chorrillos_user', JSON.stringify(response.user));
        
        dispatch({
          type: AUTH_ACTIONS.REGISTER_SUCCESS,
          payload: response
        });
        
        return { success: true };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('chorrillos_token');
    localStorage.removeItem('chorrillos_user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Verificar token al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('chorrillos_token');
      const user = localStorage.getItem('chorrillos_user');
      
      if (token && user) {
        try {
          // Aquí verificaríamos el token con el backend
          const userData = JSON.parse(user);
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: userData, token }
          });
        } catch (error) {
          localStorage.removeItem('chorrillos_token');
          localStorage.removeItem('chorrillos_user');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Funciones auxiliares para verificar roles
  const hasRole = (requiredRole) => {
    if (!state.isAuthenticated || !state.role) return false;
    
    const roleHierarchy = {
      'public': 0,
      'authorized': 1,
      'admin': 2
    };
    
    return roleHierarchy[state.role] >= roleHierarchy[requiredRole];
  };

  const isAdmin = () => hasRole('admin');
  const isAuthorized = () => hasRole('authorized');
  const isPublic = () => hasRole('public');

  const value = {
    ...state,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
    isAuthorized,
    isPublic
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// APIs mock para desarrollo
const mockLoginAPI = async (email, password) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Usuarios de prueba
  const testUsers = {
    'admin@chorrillos.gob.pe': {
      id: 1,
      email: 'admin@chorrillos.gob.pe',
      name: 'Administrador',
      role: 'admin',
      avatar: null
    },
    'usuario@chorrillos.gob.pe': {
      id: 2,
      email: 'usuario@chorrillos.gob.pe',
      name: 'Usuario Autorizado',
      role: 'authorized',
      avatar: null
    },
    'publico@example.com': {
      id: 3,
      email: 'publico@example.com',
      name: 'Usuario Público',
      role: 'public',
      avatar: null
    }
  };
  
  const user = testUsers[email];
  
  if (user && password === '123456') {
    return {
      success: true,
      user,
      token: `mock_token_${user.id}_${Date.now()}`,
      message: 'Login exitoso'
    };
  } else {
    return {
      success: false,
      message: 'Credenciales inválidas'
    };
  }
};

const mockRegisterAPI = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newUser = {
    id: Date.now(),
    email: userData.email,
    name: userData.name,
    role: 'public', // Por defecto público
    avatar: null
  };
  
  return {
    success: true,
    user: newUser,
    token: `mock_token_${newUser.id}_${Date.now()}`,
    message: 'Registro exitoso'
  };
};

