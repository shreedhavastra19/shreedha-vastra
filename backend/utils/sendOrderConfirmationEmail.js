// ================================================================
// Shreedha Vastra — Order Confirmation Email
// ================================================================
import sendEmail from './sendEmail.js';

const formatINR = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const sendOrderConfirmationEmail = async (order, user) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;">${item.name} (Size: ${item.size}, Qty: ${item.quantity})</td>
          <td style="padding:8px 0; text-align:right;">${formatINR(item.price * item.quantity)}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #B08D57;">Shreedha Vastra</h2>
      <p>Hi ${user.name || 'there'},</p>
      <p>Thank you for your order! We've received it and it's being processed.</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>

      <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
        ${itemsHtml}
      </table>

      <table style="width:100%; margin-top: 12px; border-top: 1px solid #eee; padding-top: 8px;">
        <tr><td>Items</td><td style="text-align:right;">${formatINR(order.itemsPrice)}</td></tr>
        <tr><td>Shipping</td><td style="text-align:right;">${formatINR(order.shippingPrice)}</td></tr>
        <tr><td>Tax</td><td style="text-align:right;">${formatINR(order.taxPrice)}</td></tr>
        ${
          order.discountAmount
            ? `<tr><td>Discount</td><td style="text-align:right;">-${formatINR(order.discountAmount)}</td></tr>`
            : ''
        }
        <tr style="font-weight:bold;"><td>Total</td><td style="text-align:right;">${formatINR(order.totalPrice)}</td></tr>
      </table>

      <p style="margin-top: 20px;"><strong>Shipping to:</strong><br/>
        ${order.shippingAddress.fullName}<br/>
        ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ', ' + order.shippingAddress.line2 : ''}<br/>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br/>
        ${order.shippingAddress.country}
      </p>

      <p style="margin-top: 16px; color: #888;">
        We'll email you again once your order ships. Estimated delivery:
        ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toDateString() : 'to be confirmed'}.
      </p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: `Order Confirmed - ${order.orderNumber} | Shreedha Vastra`,
    html,
  });
};

export default sendOrderConfirmationEmail;