import express from 'express'
import axios from 'axios'
import { v4 } from 'uuid'

import { TEST_IMPORTS } from '@/config/biba'
import qs from 'qs'

const router = express.Router()
const app = express()

router.post('/taros', async (req, res) => {
  const question = req.body?.question

  const authKey =
    'MWJiZGQ2MjItNGUxMy00M2VjLTgyNDktOGE5NjQ1Nzc0MjFiOmMwMzdiZjk0LTdmOGUtNGJlNS04Yzk1LTdhMjFiMmMxZWI0Yw'

  const {
    data: { access_token: accessToken },
  } = await axios.post(
    'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
    qs.stringify({
      scope: 'GIGACHAT_API_PERS',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        RqUID: v4(),
        Authorization: `Basic ${authKey}`,
      },
    },
  )

  const llmResp = await axios.post(
    'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
    {
      model: 'GigaChat',
      messages: [
        {
          role: 'user',
          content:
            'Тебя зовут Мадам Таро, ты гадалка в десятом поколении и любишь раскладывать карты ТАРО! На каждый мой вопрос ты должна отвечать раскладом карт ТАРО из трех карт, это обязательно! Если можешь дать расклад, верни ответ в формате JSON {"cards":{"name": string, "meaning: string}[],"conclusion": string,"introduction":string}',
        },
        {
          role: 'user',
          content: question,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  res.send(llmResp.data)
})

app.use(express.json())
app.use(router)
app.listen(3331)
