const Request = require('tedious').Request;  
const TYPES = require('tedious').TYPES;

var Connection = require('tedious').Connection;  
    var config = {  
        userName: 'ServerAdmin',  
        password: 'Server123',  
        server: 'soserver2018.database.windows.net', 
        //port: '1433', 
        // If you are on Microsoft Azure, you need this:  
        options: {encrypt: true, database: 'MessagesAzure'}  
    };  
    var connection = new Connection(config);
    connection.on('debug', function(err) { console.log('debug:', err);});  
    connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
        console.log("Connected");  
        request = new Request("SELECT * from dbo.MessagesAzure", function(err) {  
            if (err) {  
                console.log(err);
            }  
        });  
        var result = "";  
        request.on('row', function(columns) {
            console.log(columns.value);  
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
        connection.execSql(request); 
    });

    module.exports.connection = connection;