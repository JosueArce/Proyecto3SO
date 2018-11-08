const azure = require('azure-storage');
const config = require('./config');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const http = require('http');

app.get('/',function(error,response) {
  response.sendFile(path.resolve(__dirname + '/../index.html'));
})

app.get('/start',function(error,response) {
  startRequests();
})

app.get('/stop',function(error,response) {
  stopRequests();
})

const queueService = azure.createQueueService(config.azureStorageAccount, config.azureStorageAccessKey);

let run;

function startRequests(){
  run = setInterval(() => {
    const message = 2//Math.floor((Math.random() * 10) + 1);

    queueService.peekMessages('myqueue', function(error, results, response){
      if(!error){
        // Message text is in results[0].messageText
        console.log("Mensaje recibido", results[0].messageText)
      }
    });

    queueService.createMessage(config.queueName, "message", (err, result, res) => {
      if (err) {
        console.error(`[Queue - Sender] An error occurred: ${JSON.stringify(err)}`);
      }

      //console.log(`[Queue - Sender] Sent: ${JSON.stringify(message)}`);
    });
  }, 500);
}

function stopRequests(){
  clearInterval(run);
}

server.listen(5000,function(){
    console.log('Servidor corriendo en http://localhost:5000/');
});
// });