import * as jQuery from 'jquery';

let BggData: bggData;

export function getBggData() {
    return BggData;
}

export function initializeBggData(userName: string) {
    BggData = new bggData(userName);
}


class bggData {
    public bggCollection;
    public bggPlays;
    public fullyLoaded = false;

    constructor(userName?: string) {
        if(!userName) {
            userName = 'kaelistus';
        }
        this.getBggData(userName);
        // this.getBggPlays(userName);
    }

    private getBggData(userName: string) {
        let retry = 0;
        let that = this;

        fetch('/xml/?' + userName).then(
            function(response) {
                response.text().then((text: string) => {
                    var xmlDoc = jQuery.parseXML(text);
                    var gameList = xmlDoc.getElementsByTagName("item");
                    if (!gameList || gameList.length == 0) {
                        if (retry < 15) {
                            console.log("No games found. Retrying.");
                            setTimeout(that.getBggData.bind(that,userName), 2000);
                        }
                        ++retry;
                    }
                    else {
                        that.bggCollection = xmlDoc;
                        that.fullyLoaded = true;
                    }
                });
            }
        )
    }

    private getBggPlays(userName: string, page = 0, results = new Map<string, any>()) {
        let retry = 0;
        let that = this;

        fetch(`/plays/?${userName}&page${page}`).then(
            function(response) {
                response.text().then((text: string) => {
                    var xmlDoc = jQuery.parseXML(text);
                    var playList = xmlDoc.getElementsByTagName("plays");
                    var gameList = xmlDoc.getElementsByTagName("play");
                    if (gameList.length == 0) {
                        that.bggPlays = results;
                    }
                    else {
                        for(var i = 0; i < gameList.length; i++) {
                            const quantity = gameList[i].getAttribute("quantity");
                            const date = gameList[i].getAttribute("date");
                            const name = gameList[i].getElementsByTagName("item")[0].getAttribute("name");

                            let nameArray = results.get(name);
                            if (!nameArray) {
                                nameArray = [];
                                results.set(name, nameArray);
                            }
                            nameArray.push({date, quantity});
                        };
                        if ((playList[0].getAttribute("total") / 100) > page+1) {
                            return that.getBggPlays(userName, ++page, results);
                        } else {
                            that.bggPlays = results;
                        }
                    }
                });
            }
        )
    }
}