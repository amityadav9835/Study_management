const Razorpay = require('razorpay');
require('dotenv').config();

const keyId = process.env.RAZORPAY_KEY?.trim();
const keySecret = process.env.RAZORPAY_SECRET?.trim();

if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY and RAZORPAY_SECRET are required");
}

exports.instance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
})
