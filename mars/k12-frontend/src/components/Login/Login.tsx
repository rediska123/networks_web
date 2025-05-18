import React, {useState} from "react";
import {useUser} from "../../hooks/useUser";
import { Button, TextField } from "@mui/material";
import { Header } from "../Header/Header";
import {hostname} from "../../consts";

type LoginProps = {
  ws: WebSocket | undefined;
  setWs: (ws: WebSocket | undefined) => void;
  createWebSocket: (url: string) => WebSocket | undefined;
}

export const Login: React.FC<LoginProps> = ({ws, setWs, createWebSocket}) => {
  const {login, setUser} = useUser();
  const [userName, setUsername] = useState(login);

  // хендлер изменения введенного логина
  // (для поля ввода чтобы обновлял userName актуальным введенным значением)
  const handleChangeLogin = (event: any) => {
    setUsername(event.target.value);
  };

  // при авторизации регистрируем новое вебсокет соединеие
  // (при нажатии на кнопку входа)
  const handleClickSignInBtn = () => {
    setUser({
      userInfo: {
        Data: {
          login: userName,
        },
      },
    });
    if (ws) {
      // Закрываем webSocket соединение если есть открытое
      ws.close(1000, 'User enter ${userName}');
    } else {
      console.log('ws.close(1000, User enter userName); dont work');
    }
    // устанавливаем webSocket соединение
    setWs(
      createWebSocket(
        `ws://${hostname}:8001/?username=${encodeURIComponent(userName)}`,
      ),
    );
  };

  return (
    <>
      <div className="login">
        <Header/>
        <div className="login__card">
          <TextField 
            id="outlined-basic"
            label="Введите имя"
            variant="outlined"
            value={userName}
            onChange={handleChangeLogin} // Привязываем handleChangeLogin на изменение ввода
            fullWidth
            className="white-text-field"
          />

          <Button
            variant="contained"
            onClick={handleClickSignInBtn} // Привязываем handleClickSignInBtn на нажатие кнопки входа
            fullWidth
          >
          Войти
          </Button>

        </div>
      </div>
    </>
  );
}
