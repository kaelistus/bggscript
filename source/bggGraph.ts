import { LitElement, html} from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { Chart } from 'chart.js'
import { getBggData } from './bggData';

export class bggGraph extends LitElement {
   private gameSets;
   private gameSetString;
   private selectedGames;
   private chartData;
   private playChart;
   private gameStats;

   render() {
      return html`
      <style type="text/css">
      #textList {
        -webkit-columns: 2;
        -moz-columns: 2;
        columns: 2;
        height: 500px;
        width: 800px;
        white-space:nowrap;
      }
      #statsList {
        -webkit-columns: 2;
        -moz-columns: 2;
        columns: 1;
        height: 20px;
        width: 800px;
        white-space:nowrap;
        color: brown;
        font-weight:bold;
        margin-left: 50px;
      }
      a {
          color: black;
          text-decoration: none;
      }
      </style>
      <div id="statsList">${this.gameStats}</div>
      <div id="gamesPlayedDiv" style="position: relative; width:100%; max-width:1000px">
         <canvas id="gamesPlayed" style="width:100%">
         </canvas>
      </div>
      <div id="textList">${this.selectedGames}</div>
      `;
   }

   constructor() {
      super();

      this.gameSets = new Array(26);
      this.gameSetString = new Array(26);
      this.selectedGames = '';
      this.gameStats = '';

      for (var i = 0; i < 26; i++) {
         this.gameSets[i] = [];
         this.gameSetString[i] = [];
      }
      //Change Colors.
      const bars = [];
      bars.push("red");
      for (let ii = 0; ii < 9; ++ii) {
         bars.push("LightCoral");
      }
      for (let ii = 0; ii < 15; ++ii) {
         bars.push("LightBlue");
      }
      bars.push("blue");

      this.chartData = {
         type: 'bar',
         data: {
            labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
               "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
               "21", "22", "23", "24", "25+"],
            datasets: [
               {
                  label: 'Games Played',
                  backgroundColor: bars,
                  strokeColor: "rgba(220,220,220,0.8)",
                  highlightFill: "rgba(220,220,220,0.75)",
                  highlightStroke: "rgba(220,220,220,1)",
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
               }
            ]
         },
         options: {
            legend: {
               display: false
            },
            tooltips: {
               callbacks: {
                  title: function() {}
               },
               displayColors: false
            },
            scales: {
               yAxes: [{
                  ticks: {
                     beginAtZero: true
                  }
               }]
            }
         }
      };

      this.createPlayChart();
   }

   async createPlayChart() {
      let totalPlays = 0;
      let cdfPlays = 0;
      const cdfLambda = Math.log(0.1) / -10;
      const bggData = getBggData();
      while(!bggData.bggCollection) {
         await new Promise(r => setTimeout(r, 1000));
      }
      const doc = bggData.bggCollection;

      let gameList = doc.getElementsByTagName("item");
      let currentGame;
      for (currentGame = 0; currentGame < gameList.length; currentGame++) {
         let gamesOwnedText;
         let gamesPlayedText;
         let currentElement;
         for (currentElement = 0; currentElement < gameList[currentGame].children.length; currentElement++) {
            if (gameList[currentGame].children[currentElement].tagName == "numplays") {
               gamesPlayedText = gameList[currentGame].children[currentElement];
               totalPlays += parseInt(gamesPlayedText.textContent);
               cdfPlays += 1.0 - Math.exp(-1.0 * cdfLambda * parseInt(gamesPlayedText.textContent));
            }
            else if (gameList[currentGame].children[currentElement].tagName == "status") {
               gamesOwnedText = gameList[currentGame].children[currentElement];
            }
         }
         if (gamesPlayedText != null && gamesOwnedText != null && gamesOwnedText.attributes.length > 0 &&
            gamesOwnedText.attributes.item(0).textContent == "1") {
            let gamesPlayed = parseInt(gamesPlayedText.textContent);
            if (gamesPlayed >= 25) gamesPlayed = 25;

            this.chartData.data.datasets[0].data[gamesPlayed]++;
            this.gameSets[gamesPlayed].push(gameList[currentGame].children.item(0).textContent);
            this.gameSetString[gamesPlayed].push('<a href=\"http://boardgamegeek.com/boardgame/' +
               gameList[currentGame].attributes.item(1).value + '\">' +
               gameList[currentGame].children.item(0).textContent + '</a>');
         }
      }

      const gamesPlayedQuery = ((this as any).renderRoot.querySelector('#gamesPlayed') as any);
      const ctx = gamesPlayedQuery.getContext('2d');
      this.playChart = new Chart(ctx, this.chartData);
      
      ((this as any).renderRoot.querySelector('#gamesPlayed') as any).onclick = this.onClick.bind(this);

      this.gameStats = unsafeHTML("Total Games Played: " + totalPlays + "&emsp;&emsp;" +
         "Average Plays: " + (totalPlays / gameList.length).toFixed(2) + "&emsp;&emsp;" +
         "Continuous Friendless Metric: " + (-Math.log(1.0 - (cdfPlays / gameList.length)) / cdfLambda).toFixed(3));
      this.requestUpdate();
   }

   onClick(e) {
      //TODO Put this in a separate element
      let activeBars = this.playChart.getElementsAtEvent(e);
      if (activeBars.length != 0) {
         var clickedElementindex = activeBars[0]["_index"];
         let resultValue = parseInt(this.playChart.data.labels[clickedElementindex]);
         this.selectedGames = unsafeHTML(this.gameSetString[resultValue].join("<br>"));
      }
      this.requestUpdate();
   }
}