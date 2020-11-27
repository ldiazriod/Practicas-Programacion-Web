import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

const types = gql`

type Task{
  id:          String
  nombre:      String
  descripcion: String
  fecha:       String
  state:       String
}

input TaskInput {
  id:          String
  nombre:      String
  descripcion: String
  fecha:       String
}

type ResolveType {
  done: Boolean
}

type ResolveTypeAndString {
    done: Boolean
    error: String!
}

type ResolveTypeAndTask{
  done: Boolean
  task: Task
}

type Query {
  getTask(id: String): Task
  getTasks: [Task]!
  getTasksByState(state: String): [Task]!
  getTaskByDate(fecha: String): [Task]!
}

type Mutation {
  addTask(input: TaskInput): ResolveTypeAndString!
  removeTask(id: String): ResolveType!
  updateTask(id: String): ResolveTypeAndTask!
  completeTask(id: String): ResolveTypeAndTask!
  startTask(id: String): ResolveTypeAndTask!
  adminDeleteAll(contrasena: String): ResolveType!
}
`;

export {types}