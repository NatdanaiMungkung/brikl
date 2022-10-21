import { Resolvers } from 'generated/types'
import { Context } from '../../../libs/context'

export const query: Resolvers<Context>['Query'] = {
  users: async (_parent, _args, ctx) => ctx.prisma.user.findMany(),
  user: async (_parent, { id }, ctx) =>
    ctx.prisma.user.findUnique({
      where: { id },
    }),
  taskList: async (_parent, { userId }, ctx) => {
    const taskLists = await ctx.prisma.taskList.findMany({
      where: {
        userId
      }
    })
    return ctx.prisma.task.findMany({
      where: {
        taskListId: { in: taskLists.map(t=> t.id) }
      }
    })
  }
}
