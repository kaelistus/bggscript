import { initializeBggData } from './bggData';
import { bggGraph } from './bggGraph';
import { tabBar } from './tabBar';

var userName = window.location.search;
if (userName == null)
   userName = "kaelistus";
userName = userName.replace('?', '');

console.log('BGG XML from user: ' + userName);
initializeBggData(userName);

customElements.define('bgg-graph', bggGraph);
customElements.define('tab-bar', tabBar);

