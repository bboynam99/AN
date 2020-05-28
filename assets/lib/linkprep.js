new ClipboardJS('.copyButton');

$('.copyButton').on('click', function (){
    var address = document.getElementById("myCropAddress")
    alertify.success('<h3>Copied Referral Link</h3>', 2)
})