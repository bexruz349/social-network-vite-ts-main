import { useState } from "react";
import { Heading } from "../../components/Typography/Heading";
import { LinkText } from "../../components/Typography/LinkText";
import { Container } from "../../components/UI/Container/Container.style";
import { Input } from "../../components/UI/input/input";
import { StyleForgotPasswordPage, StyledButton } from "./ForgotPasswordPage.style";
import { useNavigate } from "react-router-dom";
import "./ForgotPasswordPage.scss";

interface User {
  email: string;
  password: string;
}

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [emailError, setEmailError] = useState(""); 
  const [newPasswordError, setNewPasswordError] = useState(""); 
  const [repeatPasswordError, setRepeatPasswordError] = useState(""); 
  const [generalMessage, setGeneralMessage] = useState(""); 
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Пароль должен содержать не менее 8 символов.";
    }
    if (!/\d/.test(password)) {
      return "Пароль должен содержать хотя бы одну цифру.";
    }
    if (!/[a-zA-Z]/.test(password)) {
      return "Пароль должен содержать хотя бы одну букву.";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    setEmailError("");
    setNewPasswordError("");
    setRepeatPasswordError("");
    setGeneralMessage("");

    
    if (!email) {
      setEmailError("Введите номер телефона или email.");
      return;
    }

    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setNewPasswordError(passwordError);
      return;
    }

    // Проверка на совпадение нового пароля и его повторения
    if (newPassword !== repeatPassword) {
      setRepeatPasswordError("Пароли не совпадают!");
      return;
    }

    
    const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    // Проверка на существование пользователя по email
    const userIndex = existingUsers.findIndex((user) => user.email === email);

    if (userIndex === -1) {
      setEmailError("Пользователь с таким email не найден!");
      return;
    }

    // Обновление пароля
    existingUsers[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(existingUsers));

    setGeneralMessage("Пароль успешно изменен!");

    // Перенаправление на страницу входа
    navigate("/");
  };

  return (
    <Container>
      <StyleForgotPasswordPage>
        <Heading headingText="Восстановление пароля" />
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Номер телефона или Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="error">{emailError}</p>} 
          <Input
            type="password"
            placeholder="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {newPasswordError && <p className="error">{newPasswordError}</p>} 

          <Input
            type="password"
            placeholder="Повторите новый пароль"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          {repeatPasswordError && <p className="error">{repeatPasswordError}</p>} 

          <StyledButton type="submit">Отправить</StyledButton>
        </form>

        {generalMessage && <p>{generalMessage}</p>} 
        <LinkText text="Вернуться к авторизации" link="/" />
      </StyleForgotPasswordPage>
    </Container>
  );
};
