// CONSTANTS
var contractAddress = '0xA3A143C94134Fd5Dc535D93C27261ecEA53bB568'; // C3D
var pricefloorAddress = '0xb0AD7c78bEBeab28019789C89e82A2D1f227105A';

// GLOBALS
var web3Mode = null;
var walletMode = 'metamask';
var currentAddress = null;
var keystore = null;
var dividendValue = 0;
var tokenBalance = 0;
var contract = null;
var muteSound = false;
var etctospend = 0 ;

var buyPrice = 0;
var globalBuyPrice = 0;
var sellPrice = 0;
var ethPrice = 0;
var currency = (typeof default_currency === 'undefined') ? 'USD' : default_currency;
var ethPriceTimer = null;
var dataTimer = null;
var infoTimer = null;

var abi = [{"constant":true,"inputs":[{"name":"_customerAddress","type":"address"}],"name":"dividendsOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_ethereumToSpend","type":"uint256"}],"name":"calculateTokensReceived","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokensToSell","type":"uint256"}],"name":"calculateEthereumReceived","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"sellPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_includeReferralBonus","type":"bool"}],"name":"myDividends","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalEthereumBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_customerAddress","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"myTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_toAddress","type":"address"},{"name":"_amountOfTokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_player","type":"address"}],"name":"referralLinkUseCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amountOfTokens","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_referredBy","type":"address"}],"name":"buy","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"reinvest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"customerAddress","type":"address"},{"indexed":false,"name":"incomingEthereum","type":"uint256"},{"indexed":false,"name":"tokensMinted","type":"uint256"},{"indexed":true,"name":"referredBy","type":"address"}],"name":"onTokenPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"customerAddress","type":"address"},{"indexed":false,"name":"tokensBurned","type":"uint256"},{"indexed":false,"name":"ethereumEarned","type":"uint256"}],"name":"onTokenSell","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"customerAddress","type":"address"},{"indexed":false,"name":"ethereumReinvested","type":"uint256"},{"indexed":false,"name":"tokensMinted","type":"uint256"}],"name":"onReinvestment","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"customerAddress","type":"address"},{"indexed":false,"name":"ethereumWithdrawn","type":"uint256"}],"name":"onWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"}];

var pricefloorABI = [{"constant":true,"inputs":[],"name":"myDividends","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"makeItRain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"myTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"hourglassAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_hourglass","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

// UTILITY FUNCTIONS
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match
        })
    }
}

function copyToClipboard (text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData('Text', text)

    } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        var textarea = document.createElement('textarea')
        textarea.textContent = text
        textarea.style.position = 'fixed'  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea)
        textarea.select()
        try {
            return document.execCommand('copy')  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn('Copy to clipboard failed.', ex)
            return false
        } finally {
            document.body.removeChild(textarea)
        }
    }
}

function updateEthPrice () {
    clearTimeout(ethPriceTimer)
    if( currency === 'ARC3D' ){
        ethPrice = 1 / (sellPrice + ((buyPrice - sellPrice) / 2))
        ethPriceTimer = setTimeout(updateEthPrice, 10000)
    } else {
        $.getJSON('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,USD,' + currency, function (result) {
            var eth = result.ETH
            var usd = result.USD
            ethPrice = parseFloat(eth)
            usdPrice = parseFloat(usd)
            ethPriceTimer = setTimeout(updateEthPrice, 10000)
        })
    }
}

function getPriceFloorInfo() {
    pricefloor.myTokens.call(function (err, result) {
        tokens = parseFloat(web3.fromWei(result.toNumber())).toFixed(1)
        $("#pricefloorTokens").html(numberWithCommas(tokens))
    });
    
    pricefloor.myDividends.call(function (err, result) {
        dividends = parseFloat(web3.fromWei(result.toNumber())).toFixed(4)
        $("#pricefloorDivs").html(dividends)
    });
}

function convertEthToWei (e) {return 1e18 * e}
function convertWeiToEth (e) {return e / 1e18}

window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
        } catch (error) {
            
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

function detectWeb3 () {
    if (typeof web3 !== 'undefined') {
        web3js = new Web3(web3.currentProvider)
        web3Mode = 'metamask'
        currentAddress = web3js.eth.accounts[0]
    } else {
        // TODO: Auto modal to show tron wallet
    }
    
    masternode = localStorage.getItem("masternode")
    if (masternode == null) {
        console.log('Masternode was empty, so it is now set to the creators address.');
        masternode = "0x67294f5F1d44c0de10e49f98553Dbd77dC7D73fD";
    } else {
        masternode = masternode;
        console.log('Masternode set. ' + masternode + ' is getting a referral bonus.');
    }

    var contractClass = web3js.eth.contract(abi)
    contract = contractClass.at(contractAddress)
    
    var priceFloorClass = web3js.eth.contract(pricefloorABI)
    pricefloor = priceFloorClass.at(pricefloorAddress)
    updateData()
    attachEvents()
    updateTokenInfo()
    getPriceFloorInfo()
}

window.addEventListener('load', function () {
    setTimeout(detectWeb3, 500)

    function call (address, method, params, amount) {
        web3js.eth.getTransactionCount(currentAddress, function (err, nonce) {
            if (err) throw err

            web3js.eth.getGasPrice(function (err, gasPrice) {
                if (err) throw err

                // Median network gas price is too high most the time, divide by 10 or minimum 1 gwei
                gasPrice = Math.max(gasPrice / 10, 1000000000)

                var tx = {
                    'from': currentAddress,
                    'to': address,
                    'value': '0x' + amount.toString(16),
                    'gasPrice': '0x' + (gasPrice).toString(16),
                    'gasLimit': '0x' + (100000).toString(16),
                    'nonce': nonce,
                }
                })
        })
    }

    function getCookie(name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);

        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        } else {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {end = dc.length;}
        }
      
        return decodeURI(dc.substring(begin + prefix.length, end));
    }

    function fund (address, amount) {
        if (walletMode === 'metamask') {
            var etcwei = convertEthToWei(amount);
            var gasvalue = 150000;
            contract.buy(masternode, {value: etcwei},function (e,r){console.log(e, r)})
        } else if (walletMode === 'web') {
            call(address, 'buy', [], convertEthToWei(amount))
        }
    }

    function sell (amount) {
        if (walletMode === 'metamask') {
            contract.sell(convertEthToWei(amount), function (e, r) {
                console.log(e, r)
            })
        } else if (walletMode === 'web') {
            call(contractAddress, 'sell', [convertEthToWei(amount)], 0)
        }
    }

    function reinvest () {
        if (walletMode === 'metamask') {
            contract.reinvest(function (e, r) {
                console.log(e, r)
            })
        } else if (walletMode === 'web') {
            call(contractAddress, 'reinvest', [], 0)
        }
    }

    function withdraw () {
        if (walletMode === 'metamask') {
            contract.withdraw(function (e, r) {
                console.log(e, r)
            })
        } else if (walletMode === 'web') {
            call(contractAddress, 'withdraw', [], 0)
        }
    }
    
    // PRICE FLOOR FUNCTIONS
    function raisefloor () {
        if (walletMode === 'metamask') {
            pricefloor.makeItRain(function (e, r) {
                console.log(e, r)
            })
        } else if (walletMode === 'web') {
            call(pricefloorAddress, 'makeItRain', [], 0)
        }
    }

  // Buy token click handler

    $('#buy-tokens').click(function () {
        let amount = $('#purchase-amount').val().trim();
        fund(contractAddress,amount)
    })
    
    $('#raisefloor').click(function () {
        raisefloor()
    })

    // Transfer handler
    $('#transfer-tokens-btn').click(function() {
        let address = $('#transfer-address').val();
        let amount = $('#transfer-tokens').val();

		console.log('hey');
		if (!web3js.isAddress(address)) {return;}
		if (!parseFloat(amount)) {return}
		let amountConverted = web3js.toBigNumber(amount * 1000000000000000000);
        transferTokens(amountConverted, address);
    });

    function transferTokens(amount, address) {
        if (walletMode === 'metamask') {
            contract.myTokens(function(err, myTokens) {
                if (parseFloat(amount) <= parseFloat(myTokens)) {
                    contract.transfer(address, amount, function(err, result) {
                        if (err) {
                            alertify.error('Uh-Oh! Something went wrong... Try again later');
                            console.log('An error occured', err);
                        }
                    })
                }
            });
        } else {
			alert.log('Transfer functionality supported only with Metamask or Trust Wallet.');
		}

	}

    $('#sell-tokens-btn').click(function () {sell($("#sell-tokens-amount").val())}) // Sell token click handler
    $('#reinvest-btn').click(function () {reinvest()}) // Reinvest click handler
    $('#withdraw-btn').click(function () {withdraw()}) // Withdraw click handler
    $('#sell-tokens-btn-m').click(function () {contract.sell(function (e, r) {console.log(e, r)})})
    $('#reinvest-btn-m').click(function () {contract.reinvest(function (e, r) {console.log(e, r)})})
    $('#withdraw-btn-m').click(function () {contract.withdraw(function (e, r) {console.log(e, r)})})
    $('#currency').val(currency)

    $('#currency').change(function () {
        currency = $(this).val()
        updateEthPrice()
    })

    updateEthPrice()

    $('#purchase-amount').bind("keypress keyup click", function (e) {
        var number = $('#purchase-amount').val();
        var numTokens = number / globalBuyPrice;
        $('.number-of-tokens').text("With " + (number==0 ? 0 : number) + " ETH you can buy " + numTokens.toFixed(3) + " ARC3D");
    })

    $('#copy-etc-address').click(function (e) {
        e.preventDefault()
        copyToClipboard('http://arcadium.network/arc3d.html?masternode='+currentAddress)
        alertify.success('Copied Masternode Link!')
    })
})

function updateData () {
    clearTimeout(dataTimer)

    var loggedIn = false

    if (walletMode === 'metamask') {
        loggedIn = typeof web3js.eth.defaultAccount !== 'undefined' && web3js.eth.defaultAccount !== null
        currentAddress = web3js.eth.defaultAccount
    } else if (walletMode === 'web') {
        loggedIn = currentAddress !== null
    }

    if (loggedIn) {
        contract.balanceOf(currentAddress, function (e, r) {
            const tokenAmount = (r / 1e18 * 0.9999)
            $('.balance').text(Number(tokenAmount.toFixed(2)).toLocaleString())
            contract.calculateEthereumReceived(r, function (e, r) {
                let bal = convertWeiToEth(r)
                $('.value').text(bal.toFixed(4))
                $('.value-usd').text(Number((convertWeiToEth(r * 1) * usdPrice).toFixed(2)).toLocaleString())
                if (tokenBalance !== 0) {
                    if (bal > tokenBalance) {
                        $('.value').addClass('up').removeClass('down')
                        setTimeout(function () {
                            $('.value').removeClass('up')
                        }, 3000)
                    } else if (bal < tokenBalance) {
                        $('.value').addClass('down').removeClass('up')
                        setTimeout(function () {
                            $('.value').removeClass('down')
                        }, 3000)
                    }
                }
                tokenBalance = bal
            })
        })

        contract.myDividends(false, function (e, r) {
            let div = convertWeiToEth(r).toFixed(6)
            let refdiv = (dividendValue - div).toFixed(6);

            $('#refdiv').text(refdiv)
            $('#refdiv-usd').text(Number((refdiv * usdPrice).toFixed(2)).toLocaleString())

            $('#nonrefdiv').text(div)
            $('#nonrefdiv-usd').text(Number((convertWeiToEth(r) * usdPrice).toFixed(2)).toLocaleString())
        })


        contract.myDividends(true, function (e, r) {
            let div = convertWeiToEth(r).toFixed(6)

            $('.div').text(div)
            $('input.div').val(div + " ETH")
            $('.div-usd').text(Number((convertWeiToEth(r) * usdPrice).toFixed(2)).toLocaleString())

            if (dividendValue != div) {
                $('.div').fadeTo(100, 0.3, function () { $(this).fadeTo(250, 1.0) })
                dividendValue = div
            }
        })
        
        contract.referralLinkUseCount(currentAddress, function (e, r) {
            $('#refUseCount').text(r)
        })

        web3js.eth.getBalance(currentAddress, function (e, r) {
            // We only want to show six DP in a wallet, consistent with MetaMask
            $('.address-balance').text(convertWeiToEth(r).toFixed(6) + ' ETH')
        })
    } else {
    }

    contract.buyPrice(function (e, r) {
        let buyPrice = convertWeiToEth(r)
        globalBuyPrice = convertWeiToEth(r)
        $('.buy').text(buyPrice.toFixed(6) + ' ')
        $('.buy-usd').text('$' + Number((buyPrice * usdPrice).toFixed(2)).toLocaleString() + ' ' + currency + '')
    })

    contract.totalSupply(function (e, r) {
        let actualSupply = r / 1e18;
        $('.contract-tokens').text(Number(actualSupply.toFixed(0)).toLocaleString());
    })
    
    // Referral Divs
    contract.dividendsOf(currentAddress, function (e, r) {
        let userDividends = convertWeiToEth(r);
        $('#referralDivs').text(userDividends.toFixed(8).toLocaleString());
    })

    contract.sellPrice(function (e, r) {
        let sellPrice = convertWeiToEth(r)
        $('.sell').text(sellPrice.toFixed(6) + ' ')
        $('.sell-usd').text('$' + Number((sellPrice * usdPrice).toFixed(2)).toLocaleString() + ' ' + currency + '')
    })

    web3js.eth.getBalance(contract.address, function (e, r) {
        $('.contract-balance').text(convertWeiToEth(r).toFixed(4) + " ")
        $('.contract-balance-usd').text('$' + Number((convertWeiToEth(r) * usdPrice).toFixed(2)).toLocaleString() + ' ' + currency + '');
    })

    $('#purchase-amount').on('input change', function() {
        var value = parseFloat($(this).val()) * 0.65;
        var tokenPriceInitial_ = 0.0000001;
    	var tokenPriceIncremental_ = 0.00000001;
		

		if ( value === 0 || Number.isNaN(value) ) {
			$('#deposit-hint').text("");
			return;
		}

		if ( value > 0) {
            contract.sellPrice(function (e, r) {
                let sellPrice = convertWeiToEth(r)
			    var tokens = value / sellPrice;
			    $('#deposit-hint').text("You will receive about " + tokens.toFixed(0) + " ARC3D");
            })	
        }
		
    })
    
    $('#sell-tokens-amount').on('input change', function() {
        var value = parseFloat($(this).val()) * 0.65;
        var tokenPriceInitial_ = 0.0000001;
    	var tokenPriceIncremental_ = 0.00000001;
		

		if ( value === 0 || Number.isNaN(value) ) {
			$('#withdraw-hint').text("");
			return;
		}

		if ( value > 0) {
            contract.buyPrice(function (e, r) {
                let buyPrice = convertWeiToEth(r)
			    var tokens = value * buyPrice;
			    $('#withdraw-hint').text("You will receive about " + tokens.toFixed(2) + " ETH");
            })	
        }
		
    });


    dataTimer = setTimeout(function () {
        updateData()
    }, web3Mode === 'metamask' ? 2000 : 6000)
}


function updateTokenInfo() {
	clearTimeout(infoTimer)

	infoTimer = setTimeout(function () {
	    updateTokenInfo()
	}, web3Mode === 'metamask' ? 5000 : 10000)	
}

function attachEvents() {
	// Always start from 10 blocks behind
	web3js.eth.getBlockNumber(function(error, result) {
		console.log("Current Block Number is", result);
	  	contract.allEvents({
			fromBlock: result - 17,
		},function(e, result) {
			let currentUserEvent = web3.eth.accounts[0] == result.args.customerAddress;
            switch(result.event) {
                case 'onTokenPurchase':
                    if (currentUserEvent) {
                        alertify.success('You Purchased ' + result.args.tokensMinted.div(1000000000000000000).toFixed(4) + ' ARC3D for ' + result.args.incomingEthereum.div(1000000000000000000).toFixed(4) + ' ETH');
					} else {
                        alertify.log(result.args.tokensMinted.div(1000000000000000000).toFixed(4) + ' ARC3D was just bought by someone, for ' + result.args.incomingEthereum.div(1000000000000000000).toFixed(4) + ' ETH.');
					}
					break;
                case 'onTokenSell':
                    if (currentUserEvent) {
                        alertify.success('You Sold ' + result.args.tokensBurned.div(1000000000000000000).toFixed(4) + ' ARC3D for ' + result.args['ethereumEarned'].div(1000000000000000000).toFixed(4) + ' ETH.');
                    } else {
                        alertify.log('Someone else sold tokens. They received ' + result.args['ethereumEarned'].div(1000000000000000000).toFixed(4) + ' ETH for ' + result.args.tokensBurned.div(1000000000000000000).toFixed(4) + ' ARC3D.');
                    }
                    break;
                case 'onWithdraw':
                    if (currentUserEvent) {
                           alertify.success('Withdrawal of ' + result.args['ethereumWithdrawn'].div(1000000000000000000).toFixed(4) + ' Successful!');
					   }
					   break;
                case 'onReinvestment':
					if (currentUserEvent) {
						alertify.success('Your reinvestment of ' + result.args.ethereumReinvested.div(1000000000000000000).toFixed(4) + 'ETH has yielded ' + result.args.tokensMinted.div(1000000000000000000).toFixed(4) + ' ARC3D tokens!');
					} else {
						alertify.success('Someone reinvested ' + result.args.ethereumReinvested.div(1000000000000000000).toFixed(4) + ' ETH and received ' + result.args.tokensMinted.div(1000000000000000000).toFixed(4) + '. ARC3D tokens!');
                    }
					break;
				case 'Transfer':
					if (currentUserEvent) {
						alertify.success('Transfer order of ' + result.args['tokens'].div(1000000000000000000).toFixed(4) + ' ARC3D tokens to' + result.args['to'] + ' placed.');
					}
					break;
            }
		})
	})
}