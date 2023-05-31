const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

// Use this token to access the HTTP API:
//     6142466886:AAFkZbasFqe6VDvmpvCuE90k2kvXMdpN_hs
// Keep your token secure and store it safely, it can be used by anyone to control your bot.

const token = "6142466886:AAFkZbasFqe6VDvmpvCuE90k2kvXMdpN_hs";
const webAppUrl = "https://storied-ganache-f8808d.netlify.app";
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
const app = express();

aapp.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {
      reply_markup: {
        keyboard: [
          [{ text: "Заполнить форму", url: webAppUrl + "/form" }],
        ],
      },
    });

    await bot.sendMessage(chatId, "Заходи в наш интернет магазин по кнопке ниже", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Сделать заказ", url: webAppUrl }],
        ],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data);
      await bot.sendMessage(chatId, "Спасибо за обратную связь!");
      await bot.sendMessage(chatId, "Ваша страна: " + data?.country);
      await bot.sendMessage(chatId, "Ваша улица: " + data?.street);

      setTimeout(async () => {
        await bot.sendMessage(chatId, "Вся информация будет отправлена в этот чат");
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { queryId, products = [], totalPrice } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Успешная покупка",
      input_message_content: {
        message_text: `Поздравляю с покупкой! Вы приобрели товар на сумму ${totalPrice} рублей: ${products
            .map((item) => item.title)
            .join(", ")}`,
      },
    });
    return res.status(200).json({});
  } catch (e) {
    return res.status(500).json({});
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server started on PORT " + PORT));
