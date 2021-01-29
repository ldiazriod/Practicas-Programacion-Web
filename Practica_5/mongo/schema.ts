import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";

export interface UserSchema{
    _id:      {$oid: string}
    email:    string;
    password: string;
    rol:      string[];
    token?:   string;
}

export interface BlogSchema{
    _id:          { $oid: string }
    tittle:       string;
    body:         string;
    author:       string;
    comments?:    IComment[];
}

export interface IComment{
    body:   string;
    author: string; 
}

export interface IUser{
    email:    string;
    password: string;
    rol:      string[];
    token?:   string;
}

export interface IBlog{
    tittle:    string;
    body:      string;
    author:    string;
    comments?: IComment[];
}



export interface IContext {
    db:    Database;
    user:  IUser;
}