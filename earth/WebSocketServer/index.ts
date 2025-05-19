import express from 'express';
import axios from 'axios';
import http from 'http';
import ws, { type WebSocket } from 'ws';

const port: number = 8005; // порт на котором будет развернут этот (вебсокет) сервер
const hostname = 'localhost'; // адрес вебсокет сервера
const transportLevelPort = 8002; // порт сервера транспортного уровня
const transportLevelHostname = 'localhost'; // адрес сервера транспортного уровня

// Интерфейс для сообщения
interface Message {
  id?: number,
  username: string,
  data?: string,
  send_time?: string,
  error?: string
}

/*
Словарь пользователей вида
{'UserName': [
{ id: 1, ws: WebSocket {...} }
], ...}
*/
type Users = Record<string, Array<{
  id: number,
  ws: WebSocket
}>>

const app = express(); // создание экземпляра приложения express
const server = http.createServer(app); // создание HTTP-сервера

// Используйте express.json() для парсинга JSON тела запроса
app.use(express.json());

// Обработка post запросов (принимает)
app.post('/receive', (req: { body: Message }, res: { sendStatus: (arg0: number) => void }) => {
  const message: Message = req.body;
  sendMessageToOtherUsers(message.username, message);
  res.sendStatus(200);
})

// запуск сервера приложения
server.listen(port, hostname, () => {
  console.log(`Server started at http://${hostname}:${port}`); // Сообщение при запуске
})

const wss = new ws.WebSocketServer({ server }) // Создаем вебсокет сервер (работает поверх http - server)
const users: Users = {} // Словарь для пользователей

// Функция отправки сообщения на транспортный уровень
const sendMsgToTransportLevel = async (message: Message): Promise<void> => {
  const response = await axios.post(`http://${transportLevelHostname}:${transportLevelPort}/send`, message)
  if (response.status !== 200) {
    message.error = 'Error from transport level by sending message'
    users[message.username].forEach(element => {
      if (message.id === element.id) {
        element.ws.send(JSON.stringify(message))
      }
    })
  }
  console.log('Response from transport level: ', response)
//sendMessageToOtherUsers(message.username, message)
}

// Функция отправки сообщения через вебсокет
function sendMessageToOtherUsers (username: string, message: Message): void {
  const msgString = JSON.stringify(message); // Приводим сообщение к строке для отправки

  for (const key in users) {
    console.log(`[array] key: ${key}, users[keys]: ${JSON.stringify(users[key])} username: ${username}`);

    if (key !== username) {
      // Отправляем всем кроме отправителя
      users[key].forEach(element => {
        element.ws.send(msgString);
      })
    }
  }
}

// Функция обработки подключения к вебсокет серверу
wss.on('connection', (websocketConnection: WebSocket, req: Request) => {
  if (req.url.length === 0) {
    console.log(`Error: req.url = ${req.url}`);
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const url = new URL(req?.url, `http://${req.headers.host}`);
  const username = url.searchParams.get('username');

  if (username !== null) {
    console.log(`[open] Connected, username: ${username}`)

    if (username in users) {
      // Если пользователь уже есть в словаре то добавляем новое подключение в список
      users[username] = [...users[username], { id: users[username].length, ws: websocketConnection }];
    } else {
      // Если новый пользователь, то добавляем его указывая подключение
      users[username] = [{ id: 1, ws: websocketConnection }];
    }
  } else {
    console.log('[open] Connected')
  }

  console.log('users collection', users) // Выводим словарь подключенных пользователей

  // Обработка принятого сообщения
  websocketConnection.on('message', (messageString: string) => {
    console.log('[message] Received from ' + username + ': ' + messageString)

    const message: Message = JSON.parse(messageString)
    message.username = message.username ?? username

    void sendMsgToTransportLevel(message)
  })

  // Отключение пользователя (удаляем его из словаря пользователей)
  websocketConnection.on('close', (event: any) => {
    console.log(username, '[close] Соединение прервано', event)

    delete users.username
  })
})