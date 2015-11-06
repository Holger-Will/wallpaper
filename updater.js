var fs    = require("fs")
var cheerio = require("cheerio")
var _  = require("underscore");
var os = require("os")
var totalmem=os.totalmem()/(1024*1024*1024)
process.title="updater"
interval=1000

df = require('node-df');


var old = _.map(os.cpus(),function(cpu){ return cpu.times;})



//DayName[dat.getDay()]

DayName=["Sonntg","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"]
Monat=["Januar","Februar","März","April","May","Juni","Juli","August","September","Oktober","November","Dezember"]

fs.readFile("../wallpaper1.svg",'utf-8',function(err,doc){
var $ = cheerio.load(doc,{xmlMode: true})
var timer=setInterval(function(){
var dat=new Date()

var dn=(dat.getDate().toString().length>1) ? dat.getDate() : "0"+dat.getDate()
var min=(dat.getMinutes().toString().length>1) ? dat.getMinutes() : "0"+dat.getMinutes()
var hr=(dat.getHours().toString().length>1) ? dat.getHours() : "0"+dat.getHours()

$("#tx").html(hr+":"+min)
$("#tag").html(DayName[dat.getDay()])
$("#tagNum").html(dn+"")
$("#MY").html(Monat[dat.getMonth()]+" "+dat.getFullYear())
var mem=os.freemem()/(1024*1024*1024)
$("#tx3").html(Math.floor((totalmem-mem)*100)/100+" GiB / "+ Math.floor((totalmem)*100)/100+" GiB")


var result = [];
    var current = _.map(os.cpus(),function(cpu){ return cpu.times; })
    _.each(current, function(item,cpuKey){
        result[cpuKey]={}

        var oldVal = old[cpuKey];
        _.each(_.keys(item),function(timeKey){
            var diff = (  parseFloat((item[timeKey]) - parseFloat(oldVal[timeKey])) / parseFloat((interval/10)));
            var name = timeKey;
            if(timeKey == "idle"){
                name = "CPU"        
                diff = 100 - diff;
            }
            //console.log(timeKey + ":\t" + oldVal[timeKey] + "\t\t" + item[timeKey] + "\t\t" + diff);  
            result[cpuKey][name]=diff.toFixed(0);
        });
    });
    var cpu=(result[0].CPU*1+result[1].CPU*1+result[2].CPU*1+result[3].CPU*1)/4
    $("#tx4").html(cpu+" %")
    old=current;

    df(function (error, response) {
    if (error) { throw error; }
 		$("#tx2").html(Math.floor(response[2].used/(1024*1024))+" GiB / "+Math.floor(response[2].size/(1024*1024))+" GiB")
	});

	fs.writeFile('../wallpaper1.svg', $.html(),function (error){
	    if (error) throw error;
	})
	
},interval)
})
