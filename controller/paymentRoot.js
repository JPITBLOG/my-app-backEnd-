const Insta = require('instamojo-nodejs');
const makePayment = (req,res) => {
    Insta.setKeys('test_e05e5240baa4be7f8a74a835bd4', 'test_6010543740351f6ad9441f9f865');

    const data = new Insta.PaymentData();
    Insta.isSandboxMode(true);

    data.purpose =  "testing payment";
    data.amount = req.body.amount;
    data.buyer_name =  "jigar patel";
    data.redirect_url =  "http://localhost:3001/successful-payment/";
    data.email =  "jigspatel1177@gmail.com";
    data.phone =  9726866688;
    data.send_email =  false;
    data.webhook= 'http://www.example.com/webhook/';
    data.send_sms= false;
    data.allow_repeated_payments =  false;

    Insta.createPayment(data, function(error, response) {
        if (error) {
            // some error
        } else {
            // Payment redirection link at response.payment_request.longurl
            const responseData = JSON.parse( response );
            const redirectUrl = responseData.payment_request.longurl;
            res.status( 200 ).json( redirectUrl );
        }
    });
}

module.exports = {
    makePayment
}