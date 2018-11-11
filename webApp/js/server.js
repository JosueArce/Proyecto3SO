const azure = require('azure-storage');
const config = require('./config');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const http = require('http');

const sqlConnection = require('./sql_connection');
// const Request = require('tedious').Request;  
// const TYPES = require('tedious').TYPES;
// const sql = require('mssql');

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
    //getMessages();
  }, 500);
}

function stopRequests(){
  clearInterval(run);
}

// var config2 = {
//   user: 'ServerAdmin',
//   password: 'Server123',
//   server: 'soserver2018.database.windows.net', 
//   database: 'MessagesAzure',
//   options: {encrypt: true, database: 'MessagesAzure'} 
// };

// // connect to your database
// sql.connect(config2, function (err) {

//   if (err) console.log(err);

//   // create Request object
//   var request = new sql.Request();
     
//   // query to the database and get the records
//   request.query('select * from dbo.MessagesAzure', function (err, recordset) {
      
//       if (err) console.log(err)
//       console.log(recordset);
//       // send records as a response
//       //res.send(recordset);
      
//   });
// });

function getMessages() {  
  request = new Request("SELECT * from dbo.MessagesAzure", function(err) {  
  if (err) {  
      console.log(err);}  
  });  
  var result = "";  
  request.on('row', function(columns) {  
      columns.forEach(function(column) {  
        if (column.value === null) {  
          console.log('NULL');  
        } else {  
          result+= column.value + " ";  
        }  
      });  
      console.log(result);  
      result ="";  
  });  

  request.on('done', function(rowCount, more) {  
  console.log(rowCount + ' rows returned');  
  });  
  sqlConnection.connection.execSql(request);  
}  

server.listen(5000,function(){
    console.log('Servidor corriendo en http://localhost:5000/');
});
// });