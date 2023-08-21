const telegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options.js");

const token = "6048199437:AAEUo3dwIGlXyhXmYL8yYuSH2Qsa2z6ByGo";

const bot = new telegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9, а ты попробуй отгадать"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра угалай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/4.webp"
      );
      return bot.sendMessage(chatId, "Добро пожаловать");
    }
    if (text === "/info") {
      let firstName = msg.first_name ? msg.first_name : "";
      let lastName = msg.last_name ? msg.last_name : "";

      // Если и имя, и фамилия отсутствуют, используем имя пользователя
      if (!firstName && !lastName && msg.username) {
        return bot.sendMessage(chatId, `Твой пользователь: @${msg.username}`);
      } else if (!firstName && !lastName) {
        return bot.sendMessage(chatId, "К сожалению, я не знаю твоего имени");
      }

      return bot.sendMessage(chatId, `Тебя зовут ${firstName} ${lastName}`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Я тебя не понимаю");
  });
  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
