var tronWeb;
var currentAddr;
var pyropressContract;

window.onload = function() {
    if (!window.tronWeb) {
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider('https://api.trongrid.io');
        const solidityNode = new HttpProvider('https://api.trongrid.io');
        const eventServer = 'https://api.trongrid.io/';

        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer,);
        window.tronWeb = tronWeb;
    }
    once();
};

async function once() {
    tronWeb = window.tronWeb;
    pyropressContract = await tronWeb.contract().at("TMQd8PyWxDs1V2Xgt9PE2xbkmjNpybpSVi");

    currentAddr = tronWeb.defaultAddress['base58'];
    console.log(currentAddr);
          
    setTimeout(function() {}, 2000);
}

function compoundDividends() {
    pyropressContract.compoundDividends().send().then(result => {
        console.log(result)
        $('#tx-readout').text(result)
        document.getElementById("tx-readout").className = "text-white";
    }).catch((err) => {
        console.log(err)
    });
}