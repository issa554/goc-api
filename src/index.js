'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    let {Server} = require("socket.io")
    let io = new Server(strapi.server.httpServer , {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    io.on('connection', (socket) => {
      
      socket.on('get-doc', async (data) => {
        socket.on('end', async function (){
          const document = await strapi.db.query('api::document.document').findOne({
            where: { id: data.id }
          });
          
          if (document) {
            let liveUsers = document.usersLive || [];
            liveUsers = liveUsers.filter(user => user !== data.username);
            await strapi.db.query('api::document.document').update({
              where: { id: data.id },
              data: { usersLive: liveUsers }
            });
            socket.join(data.id)
            socket.emit('load-doc', "res");
            socket.broadcast.to(data.id).emit('user-open', liveUsers);
            socket.emit('user-open', liveUsers);
          }
      });
        socket.on('disconnect',  () => {
        console.log("disconnect")
          
        });
        const document = await strapi.db.query('api::document.document').findOne({
          where: { id: data.id }
        });
        
        if (document) {
          const liveUsers = document.usersLive || [];
          liveUsers.push(data.username);
          const uniqueLiveUsers = [...new Set(liveUsers)];
          await strapi.db.query('api::document.document').update({
            where: { id: data.id },
            data: { usersLive: uniqueLiveUsers }
          });
          socket.join(data.id)
          socket.emit('load-doc', "res");
          socket.broadcast.to(data.id).emit('user-open', uniqueLiveUsers);
          socket.emit('user-open', uniqueLiveUsers);
        }
        
        
        socket.on('send-change', async (data) => {
          await strapi.db.query('api::document.document').update({ where: { id: data.id }, data: { content:data.data } });
          socket.broadcast.to(data.id).emit('receive-changes', data.data);
        });
      });

    
    });
  },
};
