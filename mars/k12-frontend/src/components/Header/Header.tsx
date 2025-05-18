import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useUser } from "../../hooks/useUser";

// SVG звезды
const StarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="white"
        className="star-icon"
    >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

export const Header: React.FC = () => {
    const { login, resetUser } = useUser();

    // Функция при нажатии на кнопку выхода
    const handleClickLogoutBtn = () => {
        if (login) {
            resetUser();
            console.log("Header: Debug:Пользователь вышел");
        } else {
            console.log("Header: Debug: Пользователь не авторизован");
        }
    };

    return (
        <div className="header">
            <img
                src="logo.png"
                alt="Логотип"
                className="logo"
                onClick={handleClickLogoutBtn} // Вызываем функцию выхода
            />
            <IconButton
                className="star-button"
                onClick={() => console.log("На Марс")}
            >
                <StarIcon />
            </IconButton>
        </div>
    );
};