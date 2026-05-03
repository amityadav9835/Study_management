exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2>Payment Successful</h2>
        <p>Hello ${name},</p>
        <p>Your payment was received successfully.</p>
        <p><strong>Amount:</strong> INR ${amount}</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p>Thank you for your purchase.</p>
      </body>
    </html>
  `;
};
