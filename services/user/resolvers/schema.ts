import { gql } from 'apollo-server'

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type TaskList {
    id: ID!
    tasks: [Task]
  }

  enum Status {
    DONE
    PENDING
  }

  type Task {
    id: ID!
    order: Int
    title: String!
    status: String!
  }

  input CreateTaskListInput {
    userId: String!
  }

  input CreateTaskInput {
    title: String!
    taskListId: String!
  }

  input UpdateTaskInput {
    order: Int!
    title: String!
    status: Status!
  }

  input CreateUserInput {
    username: String!
    password: String!
  }

  input UpdateUserInput {
    username: String
  }

  type MutationResult {
    success: Boolean!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    taskList(userId: ID!): [Task!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): MutationResult!
    createTaskList(input: CreateTaskListInput!): TaskList!
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
  }
`
