import Koa from 'koa'
const cors = require('koa2-cors'); //跨域处理
import Router from '@koa/router'

import { Prisma, PrismaClient } from '@prisma/client'

import { koaBody } from 'koa-body'

(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};


const app = new Koa()
const router = new Router()

const prisma = new PrismaClient()

app.use(
  cors({
      origin: function(ctx: any) { //设置允许来自指定域名请求
        return '*'
          // if (ctx.url === '/deviceAccount/detail') {
          //     return '*'; // 允许来自所有域名请求
          // }
          // return 'http://10.66.4.22:8055'; //只允许http://localhost:8080这个域名的请求
      },
      // maxAge: 5, //指定本次预检请求的有效期，单位为秒。
      // credentials: true, //是否允许发送Cookie
      allowMethods: ['*'], //设置所允许的HTTP请求方法
      allowHeaders: ['*'], //设置服务器支持的所有头信息字段
      exposeHeaders: ['*'] //设置获取其他自定义字段
  })
).use(koaBody())

// router.post('/signup', async (ctx) => {
//   const { name, email, posts } = ctx.request.body

//   const postData = posts
//     ? posts.map((post: Prisma.PostCreateInput) => {
//       return { title: post.title, content: post.content || undefined }
//     })
//     : []

//   const newUser = await prisma.user.create({
//     data: {
//       name,
//       email,
//       posts: {
//         create: postData,
//       },
//     },
//   })

//   ctx.status = 201 // Created
//   ctx.body = newUser
// })

// router.post('/post', async (ctx) => {
//   const { title, content, authorEmail: email, id } = ctx.request.body
//   const newPost = await prisma.post.create({
//     data: {
//       title,
//       content,
//       author: { connect: { id } },
//     },
//   })
//   ctx.status = 201 // Created
//   ctx.body = newPost
// })

// router.put('/post/:id/views', async (ctx) => {
//   const id = Number(ctx.params.id)

//   try {
//     const post = await prisma.post.update({
//       where: {
//         id,
//       },
//       data: {
//         viewCount: {
//           increment: 1,
//         },
//       },
//     })

//     ctx.body = post
//   } catch {
//     ctx.status = 404
//     ctx.body = { error: `Post with ID ${id} does not exist in the database` }
//   }
// })

// router.put('/publish/:id', async (ctx) => {
//   const id = Number(ctx.params.id)
//   const postToUpdate = await prisma.post.findUnique({
//     where: {
//       id,
//     },
//   })

//   if (!postToUpdate) {
//     ctx.status = 404
//     ctx.body = { error: `Post with ID ${id} does not exist in the database` }
//     return
//   }

//   const updatedPost = await prisma.post.update({
//     where: {
//       id,
//     },
//     data: {
//       published: !postToUpdate.published,
//     },
//   })

//   ctx.body = updatedPost
// })

// router.delete('/post/:id', async (ctx) => {
//   const id = Number(ctx.params.id)
//   try {
//     const deletedPost = await prisma.post.delete({
//       where: {
//         id,
//       },
//     })

//     ctx.body = deletedPost
//   } catch {
//     ctx.status = 404
//     ctx.body = { error: `Post with ID ${id} does not exist in the database` }
//   }
// })

// router.get('/users', async (ctx) => {
//   const users = await prisma.user.findMany()

//   ctx.body = users
// })

// router.get('/user/:id/drafts', async (ctx) => {
//   const id = Number(ctx.params.id)

//   const drafts = await prisma.user
//     .findUnique({
//       where: {
//         id,
//       },
//     })
//     .posts({
//       where: { published: false },
//     })

//   ctx.body = drafts
// })

// router.get('/post/:id', async (ctx) => {
//   const id = Number(ctx.params.id)
//   const post = await prisma.post.findUnique({
//     where: {
//       id,
//     },
//   })

//   ctx.body = post
// })

// router.get('/feed', async (ctx) => {
//   const { searchString, skip, take, orderBy } = ctx.query

//   const or = searchString
//     ? {
//       OR: [
//         { title: { contains: searchString as string } },
//         { content: { contains: searchString as string } },
//       ],
//     }
//     : {}

//   const posts = await prisma.post.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy as Prisma.SortOrder,
//     },
//   })
//   ctx.body = posts
// })

router.get('/product', async (ctx) => {
  const id = Number(ctx.query.id)
  const sales = Number(ctx.query.sales)
  try {
    // 构建动态查询条件
    const whereConditions:any = {};
    
    if (id) {
      whereConditions.id = Number(id);
    }
    
    if (sales) {
      whereConditions.sales = Number(sales);
    }
    console.log('whereConditions', whereConditions)

    const data = await prisma.product.findMany({
      where: whereConditions,
    })

    ctx.body = data
  } catch {
    ctx.status = 404
    ctx.body = { error: `Product with ${sales} does not exist in the database` }
  }
})

// 新增用户的文章
router.post('/post', async (ctx) => {
  const { title, content, authorEmail: email, id } = ctx.request.body
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { id } },
      create_time: Math.floor(Date.now()), 
      update_time: Math.floor(Date.now()),
    },
  })
  ctx.status = 201 // Created
  ctx.body = newPost
})
// 编辑
router.put('/postEdit', async (ctx) => {
  const { title, content, authorEmail: email, id } = ctx.request.body
  const newPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      // author: { connect: { id } },
      update_time: Math.floor(Date.now()),
    },
  })
  ctx.status = 201 // Created
  ctx.body = newPost
})
// 删除
router.delete('/postDelete', async (ctx) => {
  const id = Number(ctx.query.id)
  
  try {
    // 构建动态查询条件
    const whereConditions:any = {};
    
    if (id) {
      whereConditions.id = Number(id);
    }
    console.log('whereConditions', whereConditions)

    const data = await prisma.post.delete({
      where: whereConditions,
    })
    
  ctx.body = data
  } catch {
    ctx.status = 404
    ctx.body = { error: `删除失败` }
  }
})
// 获取文章列表
router.get('/getPost', async (ctx) => {
  const id = Number(ctx.query.id)
  const published = ctx.query.published
  try {
    // 构建动态查询条件
    const whereConditions:any = {};
    
    if (id) {
      whereConditions.id = Number(id);
    }
    
    if (published) {
      whereConditions.published = published;
    }
    console.log('whereConditions', whereConditions)

    const data = await prisma.post.findMany({
      where: whereConditions,
      // 这里可以根据需求添加其他查询条件：有关联关系-可以查到关联数据
      include: {
        author: true,
      },
    })

    ctx.body = data
  } catch {
    ctx.status = 404
    ctx.body = { error: `获取失败` }
  }
})
// 获取文章列表分页
router.get('/getPostPage', async (ctx) => {
  const title = ctx.query.title
  const startTime = Number(ctx.query.startTime)
  const endTime = Number(ctx.query.endTime)
  const published = ctx.query.published
  const page = Number(ctx.query.page) || 1
  const pageSize = Number(ctx.query.pageSize) || 10
  
  try {
    // 构建动态查询条件
    const whereConditions: any = {};
    
    if (published) {
      whereConditions.published = published;
    }
    console.log('whereConditions', whereConditions, title)

    // 构建完整的where条件
    const where = {
      AND: [
        { title: { contains: title } },
        whereConditions,
        { 
          create_time: startTime && endTime ? { 
            gte: BigInt(startTime), 
            lte: BigInt(endTime) 
          } : {}
        },
      ].filter(condition => Object.keys(condition).length > 0) // 过滤掉空条件
    }

    // 使用事务同时查询数据和总数，确保一致性
    const [data, total] = await prisma.$transaction([
      prisma.post.findMany({
        where,
        include: {
          author: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.post.count({ where })
    ])

    ctx.body = {
      code: 200, 
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    ctx.status = 404
    ctx.body = { 
      error: '获取失败'
    }
  }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/koa/README.md#using-the-rest-api`),
)
