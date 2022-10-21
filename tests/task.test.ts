const chai = require('chai');
import { resolvers } from '../services/user/resolvers'
import { typeDefs } from '../services/user/resolvers/schema'
import { makeSchema } from '../libs/server'
const EasyGraphQLTester = require('easygraphql-tester')

const schema = makeSchema({
    typeDefs,
    resolvers,
  })
chai.should()
describe('Test Static Schema Snapshot', () => {
    
    it('schema should contain types', () => {
      chai.assert.isNotNull(schema.getType("Task"))
      chai.assert.isDefined(schema.getType("TaskList"))
    })
    
    it('scheme should not contain unregistered types', () => {
      chai.assert.isUndefined(schema.getType("NotADefinedType"))
    })
})

describe('Test Queries/Mutations', () => {
    let tester:any
        
    before(() => {
        tester = new EasyGraphQLTester(typeDefs, resolvers)
    })
    
    it('Should pass if the query is valid', () => {
        const validQuery = `
        {
            taskList(userId: "1") {
            id
          }
        }
        `

        tester.test(true, validQuery)
      })
    
      it('Should fail if the query is invalid', () => {
        const validQuery = `
        {
            taskLists(userId: 1) {
            id
          }
        }
        `
        tester.test(false, validQuery)
      })

      it('Should pass if the createTaskList is valid', () => {
        const mutation = `
          mutation createTaskList($input: CreateTaskListInput!) {
            createTaskList(input: $input) {
              id
            }
          }
        `
        tester.test(true, mutation, {
            input: {
            userId: '1'
          }
        })
      })

      it('Should fail if the createTaskList is invalid', () => {
        const mutation = `
          mutation createTaskList($input: CreateTaskListInput!) {
            createTaskList(input: $input) {
              id
            }
          }
        `
        tester.test(false, mutation, {
            input: {
            userIdss: '1'
          }
        })
      })

      it('Should pass if the createTask is valid', () => {
        const mutation = `
          mutation createTask($input: CreateTaskInput!) {
            createTask(input: $input) {
              id
            }
          }
        `
        tester.test(true, mutation, {
            input: {
            title: '1',
            taskListId: "1"
          }
        })
      })

      it('Should fail if the createTask is invalid', () => {
        const mutation = `
          mutation createTask($input: CreateTaskInput!) {
            createTask(input: $input) {
              id
            }
          }
        `
        tester.test(false, mutation, {
            input: {
            titless: '1',
            taskListIdss: "1"
          }
        })
      })

      it('Should pass if the updateTask is valid', () => {
        const mutation = `
          mutation updateTask($id: ID!,$input: UpdateTaskInput!) {
            updateTask(id: $id, input: $input) {
              id
            }
          }
        `
        tester.test(true, mutation, {
            id: "1",
            input: {
            title: '1',
            order: 1,
            status: "DONE"
          }
        })
      })

      it('Should fail if the updateTask is invalid', () => {
        const mutation = `
          mutation updateTask($id: ID!,$input: UpdateTaskInput!) {
            updateTask(id: $id, input: $input) {
              id
            }
          }
        `
        tester.test(false, mutation, {
            id: "1",
            input: {
            title: '1',
            order: 1,
          }
        })
      })
})