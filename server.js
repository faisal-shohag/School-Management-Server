import terminalLink from 'terminal-link';
import ip from 'ip';
// 
import express from "express"
import "dotenv/config"
import cookieParser from 'cookie-parser';
import cors from 'cors';

// 
import authentication from './Authentication/Auth.js';
import post from './API/post.js';
import get from './API/get.js';
import { isAdminAuth } from './Middlewares/AuthenticationMiddleware.js';

const app = express()
const PORT = process.env.PORT || 5000


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
//middlewares
// app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get('/', (req, res) => {
  res.send("🚀 Working fine!")
})

app.use(authentication)
app.use(isAdminAuth)
// app.get('/faisal', (res, req) => {
//   res.send('Hello!')
// })
app.use(get)
app.use(post)



app.listen(PORT, () => {
  const localhost = terminalLink('on localhost:', `localhost:${PORT}`);
  const network = terminalLink('On your network:', `${ip.address()}:${PORT}`);
  console.log(`🚀 App is Running\n${localhost}\n${network}`)
})




export default app