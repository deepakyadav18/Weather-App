const http = require('http');
const fs = require('fs');
var requests = require('requests');
const homeFile = fs.readFileSync("home.html", 'utf8');

const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",Math.round((orgVal.main.temp-273.15)*100)/100);  //Math.round(num * 100) / 100  orgVal.main.temp-273.15
    temperature=temperature.replace("{%tempmin%}",Math.round((orgVal.main.temp_min-273.15)*100)/100);
    temperature=temperature.replace("{%tempmax%}",Math.round((orgVal.main.temp_max-273.15)*100)/100);
    temperature=temperature.replace("{%location%}",orgVal.name);
    temperature=temperature.replace("{%country%}",orgVal.sys.country);
    temperature=temperature.replace("{%tempStatus%}",orgVal.weather[0].main);
    return temperature;
    
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('http://api.openweathermap.org/data/2.5/weather?q=Lucknow&appid=fd32f1b1433ca932c514fb09cfafc5ba')
            .on('data', (chunk)=> {
                const objData=JSON.parse(chunk);
                const arrData=[objData];
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val)=>replaceVal(homeFile,val)).join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', (err)=> {
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });
    }
});

server.listen(8000,"127.0.0.1");