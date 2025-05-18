import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// конфиг для нашего стора
const persistConfig = {
  key: 'root', // ключ для хранения данных в localstorage
  storage, // Используем localstorage для хранения
};

const rootReducer = combineReducers({
  user: userSlice,  // стор состоит из одного слайса
});

// создаем редьюсера чтобы состояния автоматически сохранялись в localstorage
const persistedReducer = persistReducer(persistConfig, rootReducer);

// конфигурирем стор
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Сериализация данных
    }),
});

export const persistor = persistStore(store); // стор персистентный, чтобы данные сохранялись в localStorage