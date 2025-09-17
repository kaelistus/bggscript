const express = require('express')
var https = require("https");
const path = require('path');
var url = require('url');

const port = process.env.PORT || 5000
const BGG_AUTH_TOKEN = 'c6e430cf-ea09-4299-9b9d-83984142598f'; // <-- Change this token as needed
var targetBggCollection = 'https://boardgamegeek.com/xmlapi2/collection?username='
var targetBggCollectionTail = '&own=1&excludesubtype=boardgameexpansion';
var targetBggPlays = 'https://boardgamegeek.com/xmlapi2/plays?username='

app = express();

app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(__dirname + "/", {
   index: false, 
   immutable: true, 
   cacheControl: true,
   maxAge: "30d"
}));

app.get('/plays', (req, res) => xmlScrape(req, res, targetBggPlays, ''))
app.get('/xml', (req, res) => xmlScrape(req, res, targetBggCollection, targetBggCollectionTail))
app.get('/', (req, res)  => {
   res.sendFile(path.join(__dirname, 'BGG-Script.html'));
});

app.listen(port, () => console.log(`BGG app listening on port ${port}!`));


function xmlScrape(req, res, urlTarget, urlTail) {
   var userName = url.parse(req.url).search;
   if (userName == null)
      userName = "kaelistus";
   userName = userName.replace('?', '');
   console.log('BGG XML from user: ' + userName);
   //proxy BGG here
   const requestUrl = urlTarget + userName + urlTail;
   const options = new URL(requestUrl);
   options.headers = {
      'Authorization': `Bearer ${BGG_AUTH_TOKEN}`
   };
   https.get(options, function (response) {
      var str = '';
      response.on('data', function (chunk) {
         str += chunk;
         console.log("Data received!");
      });
      response.on('end', function () {
         console.log("End received!");
         res.end(str);
      });
      //Error handling
      response.on('close', function () {
         console.log(str, "Close received!");
      });
      response.on('error', console.error);
   });
}

