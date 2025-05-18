import React, {useState} from "react";
import {useUser} from "../../hooks/useUser";
import { Button, TextField, Box, Container, Typography } from "@mui/material";
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

  const handleChangeLogin = (event: any) => {
    setUsername(event.target.value);
  };

  // при авторизации регистрируем новое вебсокет соединеие
  const handleClickSignInBtn = () => {
    setUser({
      userInfo: {
        Data: {
          login: userName,
        },
      },
    });
    if (ws) {
      ws.close(1000, 'User enter userName');
    } else {
      console.log('ws.close(1000, User enter userName); dont work');
    }
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
            onChange={handleChangeLogin}
            fullWidth
            className="white-text-field"
          />

          <Button
            variant="contained"
            onClick={handleClickSignInBtn}
            fullWidth
          >
          Войти
          </Button>

        </div>
      </div>
    </>
  );
}
