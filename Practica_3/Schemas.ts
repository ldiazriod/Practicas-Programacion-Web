export interface ITask{
    _id:         {$oid: string}
    id:          string;
    nombre:      string;
    descripcion: string;
    fecha:       string;
    state:       string;
}