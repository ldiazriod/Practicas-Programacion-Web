  import {taskCollection} from "../Practica_3/mongoImports.ts";
  import {ITask} from "../Practica_3/Schemas.ts";

const resolvers = {
  Query: {
    getTask: async (parent: any, args: {id: string}, ctx: any, info: any) => {
      const searchTask = await taskCollection.findOne({id: args.id})
      if(searchTask){
        return{
          id: searchTask.id,
          nombre: searchTask.nombre,
          descripcion: searchTask.descripcion,
          fecha: searchTask.fecha,
          state: searchTask.state
        }
      }else{
        return false;
      }
    },
    getTasks: async (parent: any, args: {}, ctx: any, info: any) => {
      const myTasks = await taskCollection.find({});
      return myTasks;
    },
    getTasksByState: async (parent: any, args: {state: string}, ctx: any, info: any) =>{
      const auxState = args.state.toUpperCase();
      const findAllTasks = await taskCollection.find({state: auxState})
      if((auxState === "TODO") || (auxState === "DOING") || (auxState === "DONE")){
        console.log("Estas son las tareas con los estados que ha pedido")
        return findAllTasks;
      }else{
        console.log("No existe ese tipo de estado")
        return findAllTasks;
      }
    },
    getTaskByDate: async (parent: any, args: {fecha: string}, ctx: any, info: any) => {
      const comprobarFecha: string[] = args.fecha.split("/");
      const auxArray: Partial<ITask>[] = []
      if((comprobarFecha.length !== 1) && ((comprobarFecha[0].length === 4) && (comprobarFecha[1].length === 2) && (comprobarFecha[2].length === 2))){
        const stringToDate = new Date(args.fecha);
        const myTasks = await taskCollection.find({});
        myTasks.forEach((elem) =>{
          let auxToDate = new Date(elem.fecha)
          if(stringToDate > auxToDate){
            auxArray.push(elem)
          }
        })
        return auxArray;
      }else{
        return auxArray;
      }
    },
  },
  Mutation: {
    addTask: async(parent: any, {input: {id, nombre, descripcion, fecha}}: any, ctx: any, info: any) => {
      const searchRepetidos = await taskCollection.findOne({id: id})
      if(!searchRepetidos){
        const comprobarFecha: string[] = fecha.split("/");
        if((comprobarFecha.length !== 1) && ((comprobarFecha[0].length === 4) && (comprobarFecha[1].length === 2) && (comprobarFecha[2].length === 2))){
          const newTask: Partial<ITask> = {
            id: id,
            nombre: nombre,
            descripcion: descripcion,
            fecha: fecha,
            state: "TODO"
          }
          const addToMongo = await taskCollection.insertOne(newTask);
          return {
            done: true,
            error: "No hay errores, se ha añadido correctamente"
          }
        }else{
          return{
            done: false,
            error: "La fecha debe tener el siguiente formato: yyyy-mm-dd"
          }
        }
      }else{
        return {
          done: false,
          error: "Esa tarea ya existe"
        }
      }
    },
    removeTask: async(parent: any, args: {id: string}, ctx: any, info: any) => {
      const deleteTask = await taskCollection.deleteOne({id: args.id});
      if(deleteTask){
        return {
          done: true,
        }
      }else{
        return {
          done: false,
        }
      }
    },
    updateTask: async(parent: any, args: {id: string}, ctx: any, info: any) => {
      const findTheOneToUpdate = await taskCollection.findOne({id: args.id})
      if(findTheOneToUpdate){
        console.log("Meta su nueva tarea")
      }else{
        console.log("El ID no corresponde a ninguna tarea")
        return{
          done: false,
        }
      }
    },
    completeTask: async(parent: any, args: {id: string}, ctx: any, info: any) => {
      const {matchedCount} = await taskCollection.updateOne({id: args.id}, {$set: {state: "DONE"}})
      if(matchedCount){
        const findForReturn: Partial<ITask> | null = await taskCollection.findOne({id: args.id})
        console.log("La tarea ha sido cambiada DONE")
        return{
          done: true,
          task: {
            id: findForReturn?.id,
            nombre: findForReturn?.nombre,
            descripcion: findForReturn?.descripcion,
            fecha: findForReturn?.fecha,
            state: findForReturn?.state
          }
        }
      }else{
        console.log("Esa tarea no existe o no se ha podido cambiar")
        return {
          done: false
        }
      }
    },
    startTask: async(parent: any, args: {id: string}, ctx: any, info: any) => {
      const {matchedCount} = await taskCollection.updateOne({id: args.id}, {$set:{state: "DOING"}});
      if(matchedCount){
        const findForReturn: Partial<ITask> | null = await taskCollection.findOne({id: args.id})
        console.log("La tarea ha sido cambiada a DOING")
        return{
          done: true,
          task: {
            id: findForReturn?.id,
            nombre: findForReturn?.nombre,
            descripcion: findForReturn?.descripcion,
            fecha: findForReturn?.fecha,
            state: findForReturn?.state
          }
        }
      }
    },
    adminDeleteAll: async (parent: any, args: {contrasena: string}, ctx: any, info: any) => {
      const CONTRASENA_ADMIN = Deno.env.get("CONTRASENA_ADMIN")
      if(args.contrasena === CONTRASENA_ADMIN){
        const deleteAll = await taskCollection.deleteMany({})
        if(deleteAll){
          return{
            done: true,
          }
        }
      }else{
        return{
          done: false,
        }
      }
    },
  },
}

export {resolvers}

