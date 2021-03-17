var stat = [];
var numbersTweet = 1;
var userToExaminate = [];
var user = 0;
var maxLikes;

function infoUser(screen_name){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            var userInfo = JSON.parse(this.responseText);
            if(Array.isArray(userInfo)){
                alert(userInfo[0].message);
            }else{
                if(userToExaminate.includes(userInfo)){
                    alert("Utente già presente nell'analisi");
                    var divToScroll = document.getElementById(screen_name);
                    divToScroll.scrollIntoView();
                }
                statType = [['Type','Number'],['text',0],['retweet',0],['photo',0],['video',0]];
                dataToChar = [['# tweet','likes','retweet']];
                stat.push({PieChartData:statType,LineChartData: dataToChar,mediaTweet:0,mediaRetweet:0,mediaMention:0,mediaLikes: 0,maxLikedPost:null});
                userToExaminate.push(userInfo);
                var divToAppend = document.getElementById('resultStats');
                var newUser = '<div id="'+ screen_name + '"><img alt="Immagine Profilo" src="' + userInfo.profile_image_url_https + '" class="rounded-circle"><div class="row"><h2 class="col-6">' + userInfo.name + '</h2><p class="col-6">' + userInfo.description +
                            '</p></div><hr><div class="row" id="chartMetrics_' + user + '"></div>'+
                            '<div class="row" id="pieChart_'+ user + '"></div>'+
                            '<div id="generalStat_' + user + '"></div> ' +
                            '<div id="mostLikeTweet_'+ user + '"> </div><hr style="border: 3px solid black;">';
                divToAppend.innerHTML = divToAppend.innerHTML + newUser ;
                maxLikes = -1;
                getMetrics(screen_name);
                var divToScroll = document.getElementById(screen_name);
                divToScroll.scrollIntoView();
            }


        }
    };
    xhttp.open("GET","/api/user/" + screen_name,true);
    xhttp.send();

}
function getMetrics(screen_name){
    numbersTweet = 1
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
             var array = JSON.parse(this.responseText)
             array.forEach(fillData);
             google.charts.load('current', {'packages':['corechart']});
             google.charts.setOnLoadCallback(drawChart);
             google.charts.setOnLoadCallback(pieChartTypeTweet);
             showFinalStats(array);
        }
    };
    xhttp.open("GET","/api/tweets/" + screen_name,true);
    xhttp.send();
}
function fillData(tweet){
    var singleTweet = [];
    singleTweet.push(numbersTweet);

    var textTweet = tweet.text;
    var typeTweet = undefined;
    var dateHour = new Date(tweet.created_at);
    if(tweet.retweeted_status != undefined){
        typeTweet = "retweet";
        stat[user-1].PieChartData[2][1] += 1;
        textTweet = tweet.retweeted_status.text;
        singleTweet.push(tweet.retweeted_status.favorite_count);
        singleTweet.push(tweet.retweeted_status.retweet_count);
        if(maxLikes < tweet.retweeted_status.favorite_count){
            maxLikes = tweet.retweeted_status.favorite_count;
            stat[user-1].maxLikedPost = tweet;
        }
    }else{
        singleTweet.push(tweet.favorite_count);
        singleTweet.push(tweet.retweet_count);
        if(maxLikes < tweet.favorite_count){
            maxLikes = tweet.favorite_count;
            stat[user-1].maxLikedPost = tweet;
        }
        if(tweet.extended_entities != undefined){
             typeTweet = tweet.extended_entities.media[0].type;
             if(typeTweet == 'photo'){
                 stat[user-1].PieChartData[3][1] += 1;
             }else{
                 stat[user-1].PieChartData[4][1] += 1;
             }
        }else{
            typeTweet = "text";
            stat[user-1].PieChartData[1][1] += 1;
        }
    }

    stat[user-1].LineChartData.push(singleTweet);
    numbersTweet += 1;
}
function mediaPostTweet(tweets){
    var sommaSecondi = 0;
    sommaSecondi += new Date().getTime() - new Date(tweets[0].created_at).getTime();
    for(var i = 0; i < tweets.length - 1; i++){
        var secPrimo = new Date(tweets[i].created_at).getTime();
        var secSecondo = new Date(tweets[i+1].created_at).getTime();
        sommaSecondi += secPrimo - secSecondo;
    }
    stat[user-1].mediaTweet = sommaSecondi/tweets.length ;
}
function mediaRetweetMention(tweets){
    var sommaRetweet = 0;
    var sommaMention = 0;
    var sommaLikes = 0;
    for(var i = 0; i < tweets.length; i++){

        if(tweets[i].retweeted_status != undefined){
            sommaRetweet += 1;
            sommaLikes += tweets[i].retweeted_status.favorite_count;
        }else{
            sommaLikes +=  tweets[i].favorite_count;
        }


        if(tweets[i].entities.user_mentions.length > 0)
            sommaMention += 1;
    }
    stat[user-1].mediaRetweet = ((sommaRetweet*100)/tweets.length).toFixed(2);
    stat[user-1].mediaMention = ((sommaMention*100)/tweets.length).toFixed(2);
    stat[user-1].mediaLikes = Math.floor(sommaLikes/tweets.length);
}
function msToTime(ms) {
    var milliseconds = parseInt((ms % 1000) / 100),
    seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60),
    hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + " ore " + minutes + " minuti";
}
function drawChart(){
     var data = google.visualization.arrayToDataTable(stat[user-1].LineChartData)

    // append the svg object to the body of the page
    var options = {
      title: 'Twitter Metrics (Numbers of likes and retweet)',
      legend: { position: 'bottom' },
      vAxis:{viewWindow: {min: 0}},
      hAxis:{title:"# tweets (1 most recently - 100 last recently)",showTextEvery:1},
      height:500
    };
    var chart = new google.visualization.LineChart(document.getElementById('chartMetrics_' + user));

    chart.draw(data, options);
}
function showFinalStats(tweets){
    mediaPostTweet(tweets);
    mediaRetweetMention(tweets);
    var divResult = document.getElementById('generalStat_' + user);
    divResult.innerHTML = '<table class="table"><thead><tr>'+
                          '<th scope="col">Media tweet pubblicati</th>'+
                          '<th scope="col">Media retweet su tweet postati</th>'+
                          '<th scope="col">Media mentions tweet postati</th>'+
                          '<th scope="col">Media likes a post</th></tr></thead>' +
                          '<tbody><tr><td>' + msToTime(stat[user-1].mediaTweet) + '</td>'+
                          '<td>' + stat[user-1].mediaRetweet + '% </td>'+
                          '<td>' + stat[user-1].mediaMention + '% </td>'+
                          '<td>' + stat[user-1].mediaLikes + '</td>'+
                          '</tr></tbody></table>';
    var mostLikeTweet = document.getElementById('mostLikeTweet_' + user);
    var textToDisplay = stat[user-1].maxLikedPost.retweeted == false ? stat[user-1].maxLikedPost.text : stat[user-1].maxLikedPost.retweeted_status.text;
    mostLikeTweet.innerHTML = '<h2>Tweet con più likes:</h2><p> ' +  textToDisplay + '</p>';
}
function pieChartTypeTweet(){
    var data = google.visualization.arrayToDataTable(stat[user-1].PieChartData)
    var options = {
        title: 'Type of tweets'
    };

    var chart = new google.visualization.PieChart(document.getElementById('pieChart_' + user));

    chart.draw(data, options);
}
function insert_user(){
    var x = document.forms["addUser"]["username"].value;
    if (x == "") {
        alert("Il campo username non può essere vuoto");
        return false;
    }
    user += 1;
    infoUser(x);
    document.forms["addUser"]["username"].value = "";
}
