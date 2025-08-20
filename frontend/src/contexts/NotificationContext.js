import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial
const initialState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  lastUpdate: null
};

// Acciones
const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL: 'CLEAR_ALL',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  UPDATE_LAST_UPDATE: 'UPDATE_LAST_UPDATE'
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotification = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
        lastUpdate: new Date().toISOString()
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload
            ? { ...notif, isRead: true }
            : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif => ({ ...notif, isRead: true })),
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      const removedNotif = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: removedNotif && !removedNotif.isRead 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount
      };

    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS:
      return {
        ...state,
        isConnected: action.payload
      };

    case NOTIFICATION_ACTIONS.UPDATE_LAST_UPDATE:
      return {
        ...state,
        lastUpdate: action.payload
      };

    default:
      return state;
  }
};

// Contexto
const NotificationContext = createContext();

// Hook personalizado
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de NotificationProvider');
  }
  return context;
};

// Provider
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Simular conexión WebSocket para notificaciones en tiempo real
  useEffect(() => {
    let wsInterval;
    
    const simulateWebSocket = () => {
      // Simular conexión
      dispatch({ type: NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS, payload: true });
      
      // Simular notificaciones periódicas
      wsInterval = setInterval(() => {
        const mockNotifications = [
          {
            type: 'incident',
            title: 'Nuevo incidente reportado',
            message: 'Se ha reportado un incidente en el sector Centro',
            priority: 'high',
            category: 'security'
          },
          {
            type: 'camera',
            title: 'Cámara offline',
            message: 'La cámara en Av. Huaylas 123 se encuentra offline',
            priority: 'medium',
            category: 'maintenance'
          },
          {
            type: 'vigilante',
            title: 'Nuevo vigilante registrado',
            message: 'Se ha registrado un nuevo vigilante en el sector Sur',
            priority: 'low',
            category: 'registration'
          }
        ];

        // Seleccionar una notificación aleatoria
        const randomNotif = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        
        // Solo agregar notificación ocasionalmente (20% de probabilidad)
        if (Math.random() < 0.2) {
          dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: randomNotif });
        }
      }, 30000); // Cada 30 segundos
    };

    // Simular reconexión
    const simulateReconnection = () => {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS, payload: false });
      
      setTimeout(() => {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS, payload: true });
      }, 2000);
    };

    simulateWebSocket();

    // Simular desconexión/reconexión cada 5 minutos
    const reconnectionInterval = setInterval(simulateReconnection, 300000);

    return () => {
      clearInterval(wsInterval);
      clearInterval(reconnectionInterval);
    };
  }, []);

  // Funciones del contexto
  const addNotification = (notification) => {
    dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: notification });
  };

  const markAsRead = (notificationId) => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: notificationId });
  };

  const markAllAsRead = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
  };

  const removeNotification = (notificationId) => {
    dispatch({ type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION, payload: notificationId });
  };

  const clearAll = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
  };

  const sendEmailNotification = async (email, subject, message) => {
    // Simular envío de email
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Agregar notificación local
      addNotification({
        type: 'email',
        title: `Email enviado a ${email}`,
        message: subject,
        priority: 'low',
        category: 'communication'
      });

      return { success: true, message: 'Email enviado exitosamente' };
    } catch (error) {
      return { success: false, message: 'Error al enviar email' };
    }
  };

  const value = {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    sendEmailNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

