import React from "react";
import { useUser } from "../../hooks/useUser";
import { Message } from "../../consts";
import { Avatar, Card, CardContent, CardHeader, Typography } from "@mui/material";

type MessageProps = {
  msg: Message;
};

export const MessageCard: React.FC<MessageProps> = ({ msg }) => {
  const { login } = useUser();

  const avatarSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="#022B60"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );

  return (
    <div className="message-card__wrapper">
      <Card className="message-card">
        <CardHeader
          avatar={<Avatar className="message-card__avatar">{avatarSVG}</Avatar>}
          title={
            <span className="message-card__header__text">
              {msg.username ?? "Аноним"}
            </span>
          }
          className="message-card__header"
        />
        <CardContent className="message-card__content" sx={{ padding: "16px", marginTop: "-16px" }}>
          <Typography
            variant="body2"
            className="message-card__content__text"
          >
            {msg.error ? `Ошибка при отправке: ${msg.error}` : msg.data}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};