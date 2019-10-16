var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var axios = require('axios')
var sleep = require('await-sleep')
 
var doc = new GoogleSpreadsheet('144hvf0N3AyHXN1CzF40aO43Dy7nqLPGqt6Ib4f0vCpA');
var sheet;
 
async.series([
    function setAuth(step) {
        var creds = require('./secret/enari-creds.json');
        doc.useServiceAccountAuth(creds, step);
      },
    async function jynkInfoToSheet(step) {
      doc.getInfo(async function(err, info) {
        sheet = info.worksheets.find(ws => ws.title === "asd")

        sheet.setHeaderRow(['name', 'pId'], function(err, _sheet) {
          if (err) {
            console.log("error", error)
          }
        })

        let res = await axios.get("https://statsapi.web.nhl.com/api/v1/teams")
        let { data: { teams } } = res
  
        for (team of teams) {
          console.log("Processing ", team.id)
          const res = await axios.get(`https://records.nhl.com/site/api/player/byTeam/${team.id}`)
          const { data: { data } } = res 


          for (player of data) {
            await sleep(200)
            await sheet.addRow({
              name: player.fullName,
              pId: player.id
            }, function(err, rows) {console.log("Error? ", err)})
          }
        }
      })
    },
  ], function(err){
      if( err ) {
        console.log('Error: '+err);
      }
  });