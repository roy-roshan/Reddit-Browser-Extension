var subjectUrl = localStorage.getItem('url')

var button = document.getElementById("export");
button.addEventListener("click", function(){
  getData(subjectUrl+".json").then(function (data){
    let parent = data[0]['data']['children'][0]['data']
    var csvdata = [];
    csvdata.push([
      parent['title'].replace(',', ' '),parent['permalink'],"r/"+parent['subreddit'],
      parent['score'],new Date((parent['created_utc'])*1000).toLocaleString()]
    );

    for (let i = 1; i < (data[1]['data']['children'].length); i++) {
        let child = data[1]['data']['children'][i]['data'];
        // const current = Object.create(postTest);
        csvdata.push([
          child['title'].replace(',', ' '),child['permalink'],"r/"+child['subreddit'],
          child['score'],new Date((child['created_utc'])*1000).toLocaleString()]
        );
    }
    var csv = "title,link,subreddit,score,date,time\n";
    csvdata.forEach(function(row){
      csv += row.join(',');
      csv += "\n";
    });

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = csvdata[0][0]+'.csv';
    hiddenElement.click();

  async function getData(url) {
      //Returns the post in JSON format for the given URL
      url = URLformatter(url);
      const response = await fetch(url, { method: 'GET' });
      return await response.json();
  }

  function URLformatter (URL){
      return URL.replace('/comments', '/duplicates')
  }
  });
});
