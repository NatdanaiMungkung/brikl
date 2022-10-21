import { Resolvers } from 'generated/types'
import { Context } from '../../../libs/context'

export const mutation: Resolvers<Context>['Mutation'] = {
  createUser: async (_parent, { input }, ctx) =>
    ctx.prisma.user.create({ data: input }),
  updateUser: async (_parent, { id, input }, ctx) =>
    ctx.prisma.user.update({
      where: { id },
      data: {
        username: input.username ?? undefined,
      },
    }),
  createTaskList: async (_parent, { input }, ctx) => {
    return ctx.prisma.taskList.create({
      data: input
    })
  },

  createTask: async (_parent, { input }, ctx) => {
    const lastTask = await ctx.prisma.task.findFirst({
      where: {
        taskListId: input.taskListId
      },
      orderBy: {
        order: "desc"
      }
    })
    return ctx.prisma.task.create({
      data: {...input, status: "Pending", order: lastTask ? lastTask.order + 1 : 1}
    })
  },

  updateTask: async (_parent, { id, input }, ctx) => {
    const thisTask = await ctx.prisma.task.findFirst({
      where: {
        id: id
      }
    })
    if (thisTask && thisTask.order !== input.order) {
      // eg. from 1 -> 5
      if (thisTask.order < input.order) {
        await ctx.prisma.task.updateMany({
          data: {
            order: { decrement: 1}
          },
          where: {
            AND: [
              { taskListId: thisTask.taskListId},
              {order: {
                gt: thisTask.order
              }},
              {order: {
                lte: input.order
              }},
            ]
          }
        })
      } else {
        //eg from 5 -> 1
        await ctx.prisma.task.updateMany({
          data: {
            order: { increment: 1}
          },
          where: {
            AND: [
              { taskListId: thisTask.taskListId},
              {order: {
                gte: input.order
              }},
              {order: {
                lt: thisTask.order
              }},
            ]
          }
        })
      }
    }
    return ctx.prisma.task.update({
      where: { id },
      data: {
        status: input.status, title: input.title,
        order: input.order
      }
    })
  },
}
