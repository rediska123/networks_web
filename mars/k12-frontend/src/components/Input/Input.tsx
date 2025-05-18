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
      data: event.target.value,
      username: login,
      send_time: String(new Date()),
    };
    setMessage(newMsg);
  };

  // Обработчик отправки сообщения
  const handleClickSendMessBtn = () => {
    if (!message.data || !message.data.trim()) {
      console.error("Введите сообщение");
      return;
    }
    if (login && ws) {
      message.send_time = "2024-02-23T13:45:41Z";
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
        value={message.data}
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