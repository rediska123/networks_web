import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { Message } from "../../consts";
import { MessageCard } from "../MessageCard/MessageCard";
import { Typography } from "@mui/material";
import { Header } from "../Header/Header";
import { Input } from "../Input/Input";

type ChatProps = {
  messages: Message[];
  ws: WebSocket | undefined;
  messageArray: Message[];
  setMessageArray: (msg: Message[]) => void;
};

export const Chat: React.FC<ChatProps> = ({ messages, ws, messageArray, setMessageArray }) => {
  const { login } = useUser();
  const [message, setMessage] = useState<string>(""); // Состояние для поля ввода
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автопрокрутка вниз
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat">
      <Header />
      <div className="chat__body">
        <div className="chat__message-container">
          {messages.length > 0 ? (
            messages.map((msg: Message) => (
                <MessageCard msg={msg} />
            ))
          ) : (
            <Typography variant="h6" align="center" color="#fff">
              Здесь будут сообщения
            </Typography>
          )}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="chat__input-container">
          <Input ws={ws} setMessageArray={setMessageArray} />
        </div>
      </div>
    </div>
  );
};