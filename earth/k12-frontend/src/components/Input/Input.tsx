import React, { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { Message } from "../../consts";
import { Button, TextField } from "@mui/material";

type InputProps = {
  ws: any;
  setMessageArray: any;
};

export const Input: React.FC<InputProps> = ({ ws, setMessageArray }) => {
  const { login } = useUser();
  const [message, setMessage] = useState<Message>({ data: "" });

  // Обработчик изменения состояния инпута
  const handleChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMsg: Message = {
      message: event.target.value,
      username: login,
    };
    setMessage(newMsg);
  };

  // Обработчик отправки сообщения
  const handleClickSendMessBtn = () => {
    if (!message.message || !message.message.trim()) {
      console.error("Введите сообщение");
      return;
    }
    if (login && ws) {
      message.send_time = new Date().toISOString();
      const msgJSON = JSON.stringify(message);
      ws.send(msgJSON);
      setMessageArray((currentMsgArray: Message[]) => [...currentMsgArray, message]);
    }
  };

  return (
    <div className="input-container">
      <TextField
        id="outlined-basic"
        label="Сообщение"
        variant="outlined"
        placeholder="Введите сообщение"
        value={message.message}
        onChange={handleChangeMessage}
        fullWidth
        className="white-text-field"
      />
      <Button
        variant="contained"
        onClick={handleClickSendMessBtn}
        sx={{height: "56px"}}
      >
        Отправить
      </Button>
    </div>
  );
};