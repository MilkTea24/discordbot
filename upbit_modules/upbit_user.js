const { isNull } = require("lodash");
const { SlashCommandBuilder, userMention } = require('@discordjs/builders');
const request = require('request');
const upbit_coins = require('./coin_info_module');
const moment = require('moment');
const { Interaction } = require("discord.js");

var User = function(Id, name, money, coins = []) {
    this.id = Id;
    this.name = name;
    this.money = money;
    this.coins = coins;
}

var Coin = function(coin_name, market, num, total_price, average_price) {
    this.coin_name = coin_name;
    this.market = market;
    this.num = num;
    this.total_price = total_price;
    this.average_price = average_price;
}

function dorequest(options, _market) {
    return new Promise(resolve => {    
        request(options, function (error, response, body) {
            if (!error) {
                var object = JSON.parse(body);
                resolve(object[0]);
            }
            else {
                var object = {
                    market: _market,
                    trade_price: 0
                };
                resolve(object);
            }
        });
    });
}

async function getcoins(user) {
    var str = "";
    if (user.coins.length != 0){
    user.coins.sort(function(a, b) {
        return b.total_price - a.total_price;
    })
    console.log(user.coins);
    let promises = [];
    for (const user_coin of user.coins){
        var rate;
        var str_url = 'https://api.upbit.com/v1/candles/days?market=' + user_coin.market + '&count=1';

            const options = {
                method: 'GET',
                url: str_url,
                headers: {Accept: 'application/json'}
            };
                
            promises.push(dorequest(options, user_coin.market));
    }   
    let coins = await Promise.all(promises);

    var now_total_price = 0;
    var user_total_price = 0;
    for (const coin of coins){
        var user_coin = user.coins.find(v => v.market == coin.market);
        var price = coin.trade_price;
        rate = (price - user_coin.average_price) / user_coin.average_price * 100;
        now_total_price += price * user_coin.num;
        user_total_price += user_coin.total_price;
        str = str + user_coin.coin_name + ": " + user_coin.num + "개, ";
        str = str + user_coin.total_price.toLocaleString('ko-KR') + "원, 개당 ";
        str = str + user_coin.average_price.toLocaleString('ko-KR') + "원, 현재 ";
        str = str + price + "원, " + rate.toFixed(3) + "%\n";
    }

    var earn = now_total_price - user_total_price;
    var earn_rate;
    if (user_total_price == 0) earn_rate = 0;
    else earn_rate = earn / user_total_price * 100;
    str += "총 평가액" + (user_total_price + earn) + ", 총 수익: " + earn + "원, 총 수익률: " + earn_rate.toFixed(3) + "%";
    }
    return str;
}


var users_;

module.exports = {
    users: [],
    find_user: function(id) {
        for (var user of this.users){
            if (id == user.id){
                return 1;
            }
            else return 0;
        }
    },
    add_user: function(id, name) {
        var user = new User(id, name, 10000000.0);
        this.users.push(user);
    },
    reset_user_money: function(id) {
        for (var user of this.users){
            if (id == user.id){
                user.money = 10000000.0;
            }
        }
    },
    check_balance: async function(id) {
        for (const user of this.users){
            if (id == user.id){
                var promise = await getcoins(user);
                var str = user.name + "님의 잔고는 " + user.money.toLocaleString('ko-KR') + "원\n";
                str += promise;
                console.log(str);
                return str;
            }
        }
      
        /*
        var str = "아직 계좌가 없네요. 계좌를 먼저 만드세요.";
        for (const user of this.users){
            if (id == user.id){
                var now_total_price = 0;
                var user_total_price = 0;
                str = user.name + "님의 잔고는 " + user.money.toLocaleString('ko-KR') + "원\n";

                for (const coin of upbit_coins.list){
                    for (const user_coin of user.coins){
                        if (user_coin.coin_name == coin.korean_name && coin.market.substring(0,3) == "KRW"){
                            var rate;
                            var str_url = 'https://api.upbit.com/v1/candles/days?market=' + coin.market + '&count=1';
        
                             const options = {
                                method: 'GET',
                                url: str_url,
                                headers: {Accept: 'application/json'}
                            };
                            
                            var price = await dorequest(options);
                            price = Number(price);
                            console.log(price);
                            
                            rate = (price - user_coin.average_price) / user_coin.average_price * 100;
                            now_total_price += price * user_coin.num;
                            user_total_price += user_coin.total_price;
                            str = str + user_coin.coin_name + ": " + user_coin.num + "개, ";
                            str = str + user_coin.total_price.toLocaleString('ko-KR') + "원, 개당 ";
                            str = str + user_coin.average_price.toLocaleString('ko-KR') + "원";
                            str = str + price + "원, " + rate.toFixed(3) + "%\n";
                            break;
                        }
                    }
                }
                
                var earn = user_total_price - now_total_price;
                var earn_rate;
                if (user_total_price == 0) earn_rate = 0;
                else earn_rate = earn / user_total_price * 100;
                str += "총 수익: " + earn + "원, 총 수익률: " + earn_rate.toFixed(3);
            }
        }
        return str;
        */
    },

    /*
    check_balance: function(id) {
        var str = "아직 계좌가 없네요. 계좌를 먼저 만드세요.";
        var this_user;
        var print_coins = [];
        for (const user of this.users){
            if (id == user.id){
                this_user = user;
                str = "현금 : " + this_user.money;
                break;
            }
        }

        for (const coin of upbit_coins.list) {
            for (const user_coin of this_user.coins){
                if (user_coin.coin_name == coin.korean_name && coin.market.substring(0,3) == "KRW"){
                    let object = new Printcoin(user_coin.coin_name, coin.market, user_coin.num, user_coin.total_price, user_coin.average_price);
                    print_coins.push(object);
                }
            }
        }

        console.log(print_coins);

        var now_total_price = 0;
        var user_total_price = 0;
        var return_object = {
            str: str,
            now_total: now_total_price,
            user_total: user_total_price,
        }
        for (let i = 0, pending = Promise.resolve(); i < print_coins.length + 1; i++){
            if (i != print_coins.length){
                pending = pending.then(() => {
                    return new Promise((resolve) => {
                        var str_url = 'https://api.upbit.com/v1/candles/days?market=' + print_coins[i].coin_market + '&count=1';

                        const options = {
                            method: 'GET',
                            url: str_url,
                            headers: {Accept: 'application/json'}
                        };


                        request(options, function (error, response, body) {
                            if (error) throw new Error(error);
                            var object = JSON.parse(body);
                            var price = object[0].trade_price;
                            var rate = (price - print_coins[i].average_price) / print_coins[i].average_price * 100;
                            return_object.now_total += price * print_coins[i].num;
                            return_object.user_total += print_coins[i].total_price;
                            return_object.str += print_coins[i].coin_name + ": " + print_coins[i].num + "개, ";
                            return_object.str += print_coins[i].total_price.toLocaleString('ko-KR') + "원, 개당 ";
                            return_object.str += print_coins[i].average_price.toLocaleString('ko-KR') + "원. 현재 ";
                            return_object.str += price + "원, " + rate.toFixed(3) + "%\n";
                        
                            resolve(return_object);
                        });
                    });
                });  
            }
            else {
                pending = pending.then(() => {
                    return new Promise((resolve) => {
                        var earn = user_total_price - now_total_price;
                        var earn_rate;
                        if (user_total_price == 0) earn_rate = 0;
                        else earn_rate = earn / user_total_price * 100;
                        str += "총 수익: " + earn + "원, 총 수익률: " + earn_rate.toFixed(3);

                    })
                })
            }

        return Promise.resolve();
    },
    */


    //무조건 유효한 이름의 코인만 함수에 들어와야함
    //total_price를 기준으로 들어와야함
    //buy_coin 0 -> 정상 1 -> 사용자가 등록되지 않음 2 ->주문 금액이 잔고보다 많음
    buy_coin: function(id, market, coin_name, num, total_price, price) {
        for (var user of this.users){
            if (id == user.id){
                for (var coin of user.coins){
                    if (coin_name == coin.coin_name){
                        //코인을 찾았을때 실행될 부분
                        if (user.money < total_price){
                            return 2;
                        }
                        num = total_price / price;
        
                        coin.num += num;
                        coin.total_price += total_price;
                        coin.average_price = coin.total_price / coin.num;
                        user.money -= total_price;
                        return 0;
                    }
                }
                if (user.money < total_price){
                    return 2;
                }
                var new_coin = new Coin(coin_name, market, num, total_price, price);
                new_coin.coin_name = coin_name;
                user.coins.push(new_coin);
                user.money -= total_price;
                return 0;
            }
        }
        if (isNull(this.users)) return 1;
    },
    //유효한 이름이 아니여도 됨
    //sell_coin 0 -> 정상 1 -> 등록되지 않은 유저 2 -> 코인을 찾을 수 없음 3 -> 남은 잔액보다 많은 금액 매도
    sell_coin: function(id, coin_name, num, total_price, price) {
        var this_user;
        for (var user of this.user){
            if (id == user.id){
                for (var coin of user.coins){
                    if (coin_name == coin.coin_name){
                        //코인을 찾았을때 실행될 부분
                        if (coin.total_price - total_price < 0) {
                            return 3;
                        }
                        
                        user.money += total_price;
                        coin.total_price -= total_price;
                        coin.num -= num;
                        if (coin.num == 0){
                            coin.average_price = 0;
                        }
                        else{
                            coin.average_price = coin.total_price / coin.num;
                        }
        
                        return 0;
                    }
                }
            }

        }
        if (isNull(this_user)) return 1;
 
        return 2;
    }
}
