import { PrismaClient as PrismaClientDB1 } from '../prisma/generated/client_db1';
import { PrismaClient as PrismaClientDB2 } from '../prisma/generated/client_db2';
import Koa from 'koa'
import Router from '@koa/router'
import { koaBody } from 'koa-body'

const app = new Koa()

const db1 = new PrismaClientDB1();  // 连接 PostgreSQL
const db2 = new PrismaClientDB2();  // 连接 MySQL

const router = new Router()

// 查询不同的数据库
app.use(koaBody())

router.get('/users', async (ctx) => {
  const users = await db1.user.findMany();

  ctx.body = users
})

router.get('/products', async (ctx) => {
  const data = await db2.products.findMany();

  ctx.body = data
})


app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/koa/README.md#using-the-rest-api`),
)