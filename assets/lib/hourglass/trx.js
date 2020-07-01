var hourglassAddress="TXf4eo6v5hKRJxY7gLzeyrb9oCdsJoq1zi";  // D1VS Contract
var bttxgameAddress="TJ3hgteNkAy55e2gSVNj4twZkoKYpKt61N";
var dripfeederAddress="THQoRfWFa4xRjbWPQjK6wsekS1E9iEQVrg"; // Daily Contract
var userdbAddress="TZ27Uae32vbz1WshKygJU37dPPrvtVPAr4";     // ArcTag (User DB) Contract
var hourglassContract;
var bttxgameContract;
var dripFeederContract;
var userTokenBalance;
var account;
var prev_account;

async function loadTronWeb(){
    if( typeof (window.tronWeb)=== 'undefined'){
        setTimeout(loadTronWeb,1000)
    } else {
        hourglassContract = await tronWeb.contract().at(hourglassAddress);
        bttxgameContract = await tronWeb.contract().at(bttxgameAddress);
        dripFeederContract = await tronWeb.contract().at(dripfeederAddress);
        userdbContract = await tronWeb.contract().at(userdbAddress);
        setTimeout(function(){startLoop()},1000)
        setInterval(function() {main();}, 2000);
    }
}

function main() {
    getLoggedInUsername();
}

function getLoggedInUsername() {
    currentAddr = tronWeb.defaultAddress['base58'];
    userdbContract.getNameByAddress(currentAddr).call().then(result => {
        console.log(result)
        var loggedInUser = result.name.toString();
        
        if (loggedInUser == "") {
            $('.arcTag').text("Welcome, Player!")
        } else {
            $('.arcTag').text("Welcome, " + result.name + "!")
        }
        document.getElementsByClassName("arcTag").className = "text-white";
    }).catch((err) => {
        console.log(err)
    });
}

window.addEventListener("load",function() {
    loadTronWeb();
    
    // Daily Contract - INVEST Button
    $(".daily-invest-button").click(function() {
        var _0x45f9x7 = tronWeb.toSun($(".invest-input").val());
        dripFeederContract.buy(getCookie("masternode").split(";")[0]).send({
            callValue: _0x45f9x7
        }).then((_0x45f9x9) => {
            $(".invest-input").val(0)
        }).catch((_0x45f9x8) => {
            console.log(_0x45f9x8)
        })
    });
    
    // Daily Contract - WITHDRAW Button
    $(".daily-withdraw-button").click(function() {
        dripFeederContract.withdraw().send().then((_0x45f9x9) => {}).catch((_0x45f9x8) => {
            console.log(_0x45f9x8)
        })
    });
    
    // BTTX HOURGLASS
    $(".buy-bttx-input").change(function() {
        var _0xdcf0x7 = $(this).val();
        bttxgameContract.calculateTokensReceived(tronWeb.toSun(_0xdcf0x7)).call().then((result)=>{
                var _0xdcf0xa = parseInt(result) / (Math.pow(10, 18));
                $(".btt-input-buy").val(formatTrxValue(_0xdcf0xa))
            }
        ).catch((_0xdcf0x8)=>{
                console.log(_0xdcf0x8)
            }
        )
    });
    $(".sell-bttx-input").change(function() {
        var _0xdcf0xb = $(this).val();
        _0xdcf0xb = tronWeb.toHex((_0xdcf0xb * (Math.pow(10, 18))));
        bttxgameContract.calculateTronReceived(_0xdcf0xb).call().then((result)=>{
                var _0xdcf0xc = sunToDisplay(parseInt(result));
                $(".bttx-input-sell").val(_0xdcf0xc)
            }
        ).catch((_0xdcf0x8)=>{
                console.log(_0xdcf0x8)
            }
        )
    });
    
    $(".buy-bttx-button").click(function() {
        var _0xdcf0xd = tronWeb.toSun($(".buy-bttx-input").val());
        var _0xdcf0xe = getCookie("masternode").split(";")[0];
        if (_0xdcf0xe === "TEbqdbZdW18jXSa8cZbdb2BysNa8sKMuKP") {
            _0xdcf0xe = "TEbqdbZdW18jXSa8cZbdb2BysNa8sKMuKP"
        }
        ;if (tronWeb.isAddress(_0xdcf0xe) === false) {
            _0xdcf0xe = "TEbqdbZdW18jXSa8cZbdb2BysNa8sKMuKP"
        }
        ;bttxgameContract.buy(_0xdcf0xe).send({
            tokenValue: _0xdcf0xd, tokenId: '1002000', feeLimit: 10000000
        }).then((result)=>{
                $(".buy-bttx-input").val(0);
                $(".buy-bttx-input").trigger("change")
            }
        ).catch((_0xdcf0x8)=>{
                console.log(_0xdcf0x8)
            }
        )
    });
    
    $(".sell-bttx-button").click(function() {
        var _0xdcf0xb = $(".sell-bttx-input").val();
        _0xdcf0xb = tronWeb.toHex((_0xdcf0xb * (Math.pow(10, 18))));
        bttxgameContract.sell(_0xdcf0xb).send({
            feeLimit: 10000000
        }).then((result)=>{
                $(".sell-bttx-input").val(0);
                $(".bttx-input-sell").val("0.00000000")
            }
        ).catch((_0xdcf0x8)=>{
                console.log(_0xdcf0x8)
            }
        )
    });
    $(".btn-reinvest-bttx").click(function() {
        bttxgameContract.reinvest().send({
            feeLimit: 10000000
        }).then((result)=>{}
        ).catch((_0xdcf0x8)=>{
                console.log(_0xdcf0x8)
            }
        )
    });
    
    $(".btn-withdraw-bttx").click(function() {
        bttxgameContract.withdraw().send({
            feeLimit: 10000000
        }).then((result)=>{}
        ).catch((_0xdcf0x8)=>{
                console.log(_0xdcf0x8)
            }
        )
    });
    
    // TRX HOURGLASS
    // buy input
    $(".buy-input").change(function(){
        var txValue=$(this).val();
        hourglassContract.calculateTokensReceived(tronWeb.toSun(txValue)).call().then((result)=>{
            var buyAmount=parseInt(result)/ (Math.pow(10,18));
            $('.token-input-buy').val(formatTrxValue(buyAmount))
        }).catch((error)=>{console.log(error)})
    });
    
    // sell input
    $(".sell-input").change(function(){
        var _sellInput=$(this).val();
        _sellInput= tronWeb.toHex((_sellInput* (Math.pow(10,18))));
        hourglassContract.calculateTronReceived(_sellInput).call().then((result)=>{
            var sellAmount=sunToDisplay(parseInt(result));
            $(".token-input-sell").val(sellAmount)
        }).catch((error)=>{console.log(error)})
    });
    
    // buy token button
    $(".buy-token-button").click(function(){
        var buyTotal=tronWeb.toSun($(".buy-input").val());
        hourglassContract.buy(getCookie("masternode").split(";")[0]).send({
            callValue:buyTotal
        }).then((result)=>{
            $(".buy-input").val(0);
            $(".buy-input").trigger("change")
        }).catch((error)=>{console.log(error)})
    });
    
    // sell-token-btn.click
    $(".sell-token-button").click(function(){
        var sellTotal=$(".sell-input").val();
        sellTotal= tronWeb.toHex((sellTotal * (Math.pow(10,18))));
        hourglassContract.sell(sellTotal).send().then((result)=>{
            $(".sell-input").val(0);
            $(".token-input-sell").val("0.00000000")
        }).catch((error)=>{console.log(error)})
    });
    
    // sell-token-btn.click
    $(".transfer-token-button").click(function(){
        var transferTotal=$(".transfer-input").val();
        var recipientAddr=$(".recipient-input").val();
        transferTotal= tronWeb.toHex((transferTotal * (Math.pow(10,18))));
        hourglassContract.transfer(recipientAddr, transferTotal).send().then((result)=>{
            $(".transfer-input").val(0);
            $(".recipient-input").val("Recipient Address...")
        }).catch((error)=>{console.log(error)})
    });

    $(".btn-reinvest").click(function(){hourglassContract.reinvest().send().then((result)=>{}).catch((error)=>{console.log(error)})});
    $(".btn-withdraw").click(function(){hourglassContract.withdraw().send().then((result)=>{}).catch((error)=>{console.log(error)})});
});

function startLoop(){
    refreshData();
    setTimeout(startLoop,3000)
}

function refreshData(){
    updateUserInformation();
    updateNetworkInformation()
}

function updateNetworkInformation(){
    hourglassContract.totalTronBalance().call().then((result)=>{
        var TRXBalance=sunToDisplay(parseInt(result));
        $("#contract-trx-balance").html(TRXBalance)
    }).catch((error)=>{console.log(error)});
    
    hourglassContract.totalSupply().call().then((result)=>{
        var C3TBalance=parseInt(result)/ (Math.pow(10,18));
        $("#contract-token-balance").html(formatTrxValue(C3TBalance))
    }).catch((error)=>{console.log(error)});
    
    hourglassContract.calculateTokensReceived(tronWeb.toSun(1)).call().then((result)=>{
        var RateToBuy=parseInt(result)/ (Math.pow(10,18));
        RateToBuy= 1/ RateToBuy;
        $("#rate-to-buy").html(formatTrxValue(RateToBuy))
    }).catch((error)=>{console.log(error)});
    
    tronWeb.trx.getBalance(tronWeb.defaultAddress.base58).then((_0xbc13x14)=>{
        var BalanceDisplay=sunToDisplay(parseInt(_0xbc13x14));
        $("#user-wallet-balance").html(BalanceDisplay)
    }).catch((error)=>console.error(error));

    hourglassContract.calculateTronReceived(""+ (Math.pow(10,18))).call().then((result)=>{
        var _0xbc13x16=sunToDisplay(parseInt(result));
        $("#rate-to-sell").html(_0xbc13x16)
    }).catch((error)=>{console.log(error)});
    
    // BTTX
    bttxgameContract.totalTronBalance().call().then((result)=>{
        var gameTronBalance = sunToDisplay(parseInt(result));
        $("#contract-btt-balance").html(gameTronBalance)
        $.ajax({
            url: "https://min-api.cryptocompare.com/data/price?fsym=BTT&tsyms=USD",
            success: function(price) {$("#contract-btt-balance-usd").html(parseFloat(parseFloat(gameTronBalance * price.USD).toFixed(2)))}
        })
    }).catch((_0xdcf0x8)=>{console.log(_0xdcf0x8)});
    
    bttxgameContract.totalSupply().call().then((result)=>{
            var _0xdcf0x13 = parseInt(result) / (Math.pow(10, 18));
            $("#contract-bttx-balance").html(formatTrxValue(_0xdcf0x13))
        }
    ).catch((_0xdcf0x8)=>{console.log(_0xdcf0x8)});
    
    // ASSHOLE PRICE FUNCTION NOT WORKING.
    bttxgameContract.buyAndSellPrice().call().then((result)=>{
            var buyRate = parseInt(result) / (Math.pow(10, 6));
            buyRate = (1 / buyRate);
            $("#rate-to-buy-bttx").html(formatTrxValue(buyRate))
        }
    ).catch((err)=>{console.log(err)});
    
    bttxgameContract.getTokenBalance(tronWeb.defaultAddress.base58).call().then(result => {
        $(".user-wallet-btt-balance").html(sunToDisplay(parseInt(result)));
    }).catch((err) => {console.log(err)});
    
    bttxgameContract.calculateTronReceived("" + (Math.pow(10, 18))).call().then((result)=>{
        var _0xdcf0x17 = sunToDisplay(parseInt(result));
        $("#rate-to-sell-bttx").html(_0xdcf0x17)
    }).catch((_0xdcf0x8)=>{console.log(_0xdcf0x8)});
}

function updateUserInformation(){
    // DAILY INFO
    dripFeederContract.checkInvestments(tronWeb.defaultAddress.base58).call().then((result) => {
        var userEarnRate = sunToDisplay(parseInt(result / 30)).toFixed(2);
        var userInvestments = sunToDisplay(parseInt(result));
        $("#your-daily-invest").html(userInvestments)
        $("#your-earn-rate").html(userEarnRate)
    }).catch((err) => {
        console.log(err)
    });
    
    dripFeederContract.getDividends(tronWeb.defaultAddress.base58).call().then((_0x45f9x9) => {
        var _0x45f9xe = sunToDisplay(parseInt(_0x45f9x9));
        $("#your-daily-dividends").html(_0x45f9xe)
    }).catch((_0x45f9x8) => {
        console.log(_0x45f9x8)
    });
    
    dripFeederContract.getBalance(tronWeb.defaultAddress.base58).call().then((_0x45f9x9) => {
        var _0x45f9xe = sunToDisplay(parseInt(_0x45f9x9));
        $("#your-daily-balance").html(_0x45f9xe)
    }).catch((_0x45f9x8) => {
        console.log(_0x45f9x8)
    });
    
    // BTTX HOURGLASS
    bttxgameContract.balanceOf(tronWeb.defaultAddress.base58).call().then((result)=>{
        var _0xdcf0x19 = parseInt(result) / (Math.pow(10, 18));
        userTokenBalance = _0xdcf0x19;
        $(".user-bttx-balance").html(formatTrxValue(_0xdcf0x19));
        bttxgameContract.calculateTronReceived(result).call().then((result)=>{
            var _0xdcf0x1a = sunToDisplay(parseInt(result));
            $("#user-btt-balance").html(_0xdcf0x1a);
            $.ajax({
                url: "https://min-api.cryptocompare.com/data/price?fsym=BTT&tsyms=USD", 
                success: function(_0xdcf0x1b) {$("#user-bttx-usd-balance").html(parseFloat(parseFloat(_0xdcf0x1a * _0xdcf0x1b.USD).toFixed(2)))}
            })
        }).catch((_0xdcf0x8)=>{console.log(_0xdcf0x8)})}).catch((_0xdcf0x8)=>{console.log(_0xdcf0x8)});
    
    bttxgameContract.myDividends(true).call().then((result)=>{
        var _0xdcf0x1c = sunToDisplay(parseInt(result));
        $(".user-btt-dividends").html(_0xdcf0x1c);
        $.ajax({
            url: "https://min-api.cryptocompare.com/data/price?fsym=BTT&tsyms=USD",
            success: function(_0xdcf0x1b) {$("#user-btt-dividends-usd").html(parseFloat(parseFloat(_0xdcf0x1c * _0xdcf0x1b.USD).toFixed(2)))}
        });
          
        bttxgameContract.calculateTokensReceived(result).call().then((result)=>{
            var _0xdcf0x1d = parseInt(result) / (Math.pow(10, 18));
            $("#user-reinvest-bttx").html(formatTrxValue(_0xdcf0x1d))
        }).catch((_0xdcf0x8)=>{console.log(_0xdcf0x8)})}).catch((_0xdcf0x8)=>{console.log(_0xdcf0x8)});
    
    // HOURGLASS INFO
    hourglassContract.balanceOf(tronWeb.defaultAddress.base58).call().then((result)=>{
        var balanceVar=parseInt(result)/ (Math.pow(10,18));
        userTokenBalance= balanceVar;
        $(".user-token-balance").html(formatTrxValue(balanceVar));
        hourglassContract.calculateTronReceived(result).call().then((result)=>{
            var _0xbc13x19=sunToDisplay(parseInt(result));
            $("#user-trx-balance").html(_0xbc13x19);
            $.ajax({
                url:"https://min-api.cryptocompare.com/data/price?fsym=TRX&tsyms=USD",success:function(_0xbc13x1a){
                    $("#user-usd-balance").html(parseFloat(parseFloat(_0xbc13x19* _0xbc13x1a.USD).toFixed(2)))
                }
            })
        }).catch((error)=>{console.log(error)})
    }).catch((error)=>{console.log(error)});
    
    hourglassContract.myDividends(true).call().then((result)=>{
        var _0xbc13x1b=sunToDisplay(parseInt(result));
        $(".user-dividends").html(_0xbc13x1b);
        $.ajax({
            url:"https://min-api.cryptocompare.com/data/price?fsym=TRX&tsyms=USD",success:function(_0xbc13x1a){
                $("#user-dividends-usd").html(parseFloat(parseFloat(_0xbc13x1b* _0xbc13x1a.USD).toFixed(2)))
            }
        })
        
        hourglassContract.calculateTokensReceived(result).call().then((result)=>{
            var _0xbc13x1c=parseInt(result)/ (Math.pow(10,18));
            $("#user-reinvest").html(formatTrxValue(_0xbc13x1c))
        }).catch((error)=>{console.log(error)})
    }).catch((error)=>{console.log(error)});
    
    $("#reflink").val("https://arcadium.network/divs.html?masternode=" + tronWeb.defaultAddress.base58)
}

function checkwallet(){
    var _0xbc13x1e=$("#thewallet").val();
    if(_0xbc13x1e.length== 34){
        for(i= 1;i<= 4;i++){$(".f" + i).show()};
        account= _0xbc13x1e;
        localStorage.setItem("wallet",account)
    } else {account= 0}
}

function sunToDisplay(_0xbc13x20){return formatTrxValue(tronWeb.fromSun(_0xbc13x20))}
function formatTrxValue(_0xbc13x22){return parseFloat(parseFloat(_0xbc13x22).toFixed(2))}

function getQueryVariable(_0xbc13x24){
    var _0xbc13x25=window.location.search.substring(1);
    var _0xbc13x26=_0xbc13x25.split("&");
    for(
        var _0xbc13x27=0;
        _0xbc13x27< _0xbc13x26.length;
        _0xbc13x27++
    ){
        var _0xbc13x28=_0xbc13x26[_0xbc13x27].split("=");
        if(_0xbc13x28[0]== _0xbc13x24){return _0xbc13x28[1]}
    };
    return (false)
}

function translateQuantity(_0xbc13x2a,_0xbc13x2b){
    _0xbc13x2a= Number(_0xbc13x2a);
    finalquantity= _0xbc13x2a;
    modifier= "";
    if(_0xbc13x2b== undefined){_0xbc13x2b=0};
    if(_0xbc13x2a< 1000000){_0xbc13x2b=0};
    if(_0xbc13x2a> 1000000){
        modifier= "M";
        finalquantity= _0xbc13x2a/ 1000000
    };
    
    if(_0xbc13x2a> 1000000000){
        modifier= "B";
        finalquantity= _0xbc13x2a/ 1000000000
    };
    
    if(_0xbc13x2a> 1000000000000){
        modifier= "T";
        finalquantity= _0xbc13x2a/ 1000000000000
    };
    
    if(_0xbc13x2b== 0){finalquantity= Math.floor(finalquantity)};
    return finalquantity.toFixed(_0xbc13x2b)+ modifier
}