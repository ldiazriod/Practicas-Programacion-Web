const mainApi = (ctx: any) =>{
    ctx.response.body = 
    "Use /characters to see al characters, " + "Use /episodes to see all episodes, " + "Use /locations to see al locations"
}

export{mainApi};