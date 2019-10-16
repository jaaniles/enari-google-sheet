var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var axios = require('axios')
var sleep = require('await-sleep')
 
var doc = new GoogleSpreadsheet('144hvf0N3AyHXN1CzF40aO43Dy7nqLPGqt6Ib4f0vCpA');
var sheet;
 
async.series([
    function setAuth(step) {
        var creds = require('./enari-creds.json');
        doc.useServiceAccountAuth(creds, step);
      },
    async function jynkInfoToSheet(step) {
      console.log("hello")
      doc.getInfo(async function(err, info) {
        sheet = info.worksheets.find(ws => ws.title === "Data")
        sheet.setHeaderRow(['pId', 'name'], function(err, _sheet) {
          console.log(err, _sheet)
        })
  
        let res = await axios.get("https://statsapi.web.nhl.com/api/v1/teams")
        let { data: { teams } } = res
  
        data.forEach(async player => {
          timeout(100)
          await sheet.addRow({
            pId: player.id,
            name: player.fullName
          }, function(err, rows) {console.log("Error? ", err)})
        })
      })
    },
  ], function(err){
      if( err ) {
        console.log('Error: '+err);
      }
  });