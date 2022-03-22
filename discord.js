const { Client } = require('discord.js');
const { token } = require('./token.json');
const { prefix } = require('./config.json');
const fetch = require('node-fetch');
const request = require('request')
const client = new Client();
var rand = 0;
// 建立一個類別來管理 Property 及 Method
function getRandom(x) {
  return Math.floor(Math.random() * x);
};
class Bot {

  constructor() {
    this.isPlaying = false;
    this.queue = {};
    this.connection = {};
    this.dispatcher = {};
  }
  ask(msg) {
    rand = getRandom(50); //會回傳0~2之間的隨機數字
    const { answer } = require('./answer.json');
    msg.reply(answer[rand])
  }
  me(msg) {
    msg.reply(msg.author.displayAvatarURL());
  }
  eat(msg) {
    rand = getRandom(26); //會回傳0~2之間的隨機數字
    const { dinner } = require('./dinner.json');
    msg.reply(dinner[rand])
  }
  eatChoose(msg) {
    const args = msg.content.replace(`${prefix}eat`, '').trim();
    var arr = args.split(",");
    rand = getRandom(arr.length - 1); //會回傳0~2之間的隨機數字
    //console.log(arr.length)
    if (arr[0] != '') {
      msg.reply(arr[rand])
    }
  }
  lolname(msg) {
    const args = msg.content.replace(`${prefix}lolname`, '').trim();
    msg.reply('https://twlolstats.com/summoner/?summoner=' + args);
    //ansurl = 'https://twlolstats.com/summoner/?summoner=' + args;
    //msg.reply( "[args]("+ansurl+")");
  }
  lolhero(msg) {
    const args = msg.content.replace(`${prefix}lolhero`, '').trim();
    msg.reply('https://twlolstats.com/twstat/champion/' + args + '/');
  }
  lolteam(msg) {
    const args = msg.content.replace(`${prefix}lolteam`, '').trim();
    var arr = args.split(/[\s\n]/);
    msg.reply('https://twlolstats.com/teammate/?teammates=' + arr[0] + '+' + arr[1] + '%0D%0A' + arr[2] + '+' + arr[3] + '%0D%0A' + arr[4] + '+' + arr[5] + '%0D%0A' + arr[6] + '+' + arr[7] + '%0D%0A' + arr[8] + '+' + arr[9] + '%0D%0A');
  }
  weather(msg) {
    const args = msg.content.replace(`${prefix}weather`, '').trim();
    var locat = args;
    var today = new Date();
    var Year = today.getFullYear();
    var Month = today.getUTCMonth() + 1 > 9 ? today.getUTCMonth() + 1 : '0' + (today.getUTCMonth() + 1);
    var Day = today.getDate() + 1 > 9 ? today.getDate() + 1 : '0' + (today.getDate() + 1);
    if (today.getHours() > 0 && today.getHours() < 6) Day = Day - 1
    var tomorrow = Year + '-' + Month + '-' + Day + 'T06%3A00%3A00';
    const url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-1658FA85-3077-4C8A-8DC4-EE33F3A2CD2A&locationName=&elementName=&sort=time&startTime=' + tomorrow;
    var str = '';
    var weather = '';
    request(url, (err, res, body) => {
      //console.log(tomorrow)
      //console.log(body)
      var data = JSON.parse(body)
      //console.log(data.records.location)
      data.records.location.forEach(function (item) {
        if (item.locationName == locat) {
          str += ('\n' + item.locationName);
          item.weatherElement.forEach(function (item1) {
            if (item1.elementName == 'PoP') {
              str += '降雨機率:';
              str += (item1.time[0].parameter.parameterName + '%\n');
            }
            if (item1.elementName == 'MinT') {
              weather += (item1.time[0].parameter.parameterName + ' ~ ');
            }
            if (item1.elementName == 'MaxT') {
              weather += (item1.time[0].parameter.parameterName + '°C\n');
            }
            if (item1.elementName == 'CI') {
              str += '體感:';
              str += (item1.time[0].parameter.parameterName + '\n');
            }
            if (item1.elementName == 'Wx') {
              str += '明日天氣:';
              str += (item1.time[0].parameter.parameterName + '\n');
            }
          });
        }
      });
      if (str != '') {
        str += ('氣溫:' + weather);
        msg.reply(str);
      }
    })
  }
}

const bot = new Bot();
// 當 Bot 接收到訊息時的事件
client.on('message', async (msg) => {

  // 如果發送訊息的地方不是語音群（可能是私人），就 return
  if (!msg.guild) return;

  // !!join
  if (msg.content === `${prefix}eat`) {
    // 機器人加入語音頻道
    bot.eat(msg);
  }
  if (msg.content === `${prefix}me`) {
    // 機器人加入語音頻道
    bot.me(msg);
  }
  if (msg.content.indexOf(`${prefix}ask`) > -1) {
    if (msg.channel.id == "819538795572494376")
      bot.ask(msg);
  }
  if (msg.content.indexOf(`${prefix}eat`) > -1) {
    if (msg.channel.id == "819538795572494376")
      bot.eatChoose(msg);
  }
  if (msg.content.indexOf(`${prefix}weather`) > -1) {
    if (msg.channel.id == "819873924883677215")
      bot.weather(msg);
  }
  if (msg.content.indexOf(`${prefix}lolname`) > -1) {
    if (msg.channel.id == "892375860227735592")
      bot.lolname(msg);
  }
  if (msg.content.indexOf(`${prefix}lolhero`) > -1) {
    if (msg.channel.id == "892375860227735592")
      bot.lolhero(msg);
  }
  if (msg.content.indexOf(`${prefix}lolteam`) > -1) {
    if (msg.channel.id == "892375860227735592")
      bot.lolteam(msg);
  }
});

// 連上線時的事件
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.login(token);