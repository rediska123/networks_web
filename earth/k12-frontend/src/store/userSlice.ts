import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  login: '',  // все что нужно знать о пользователе - его логин
};

const dataSlice = createSlice({
  name: 'user',
  initialState: {
    Data: initialState
  },

  reducers: {
    setData(state, { payload }) {
      // При входе в систему
      state.Data = payload.Data;  // будем сеттить юзера при логине
    },

    cleanUser: (state) => {
      // При выходе из системы
      state.Data.login = '';  // чистим логин юзера когда он выйдет
    },
  },
});

export const {
  setData: setUserDataAction,
  cleanUser: cleanUserDataAction
} = dataSlice.actions; // Экшены для изменения состояния слайса

export default dataSlice.reducer;