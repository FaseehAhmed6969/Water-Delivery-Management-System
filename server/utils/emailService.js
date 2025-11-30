const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send order confirmation email
exports.sendOrderConfirmation = async (customerEmail, customerName, orderId, orderDetails) => {
    try {
        const mailOptions = {
            from: `AquaFlow <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: '✅ Order Confirmed - AquaFlow',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">💧 AquaFlow</h1>
            <p style="color: white; margin: 10px 0 0 0;">Premium Water Delivery</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Order Confirmed!</h2>
            <p style="color: #666; font-size: 16px;">Hi ${customerName},</p>
            <p style="color: #666; font-size: 16px;">Thank you for your order! We're processing it now.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0; color: #666;"><strong>Order ID:</strong> #${orderId.slice(-6)}</p>
              <p style="margin: 10px 0 0 0; color: #666;"><strong>Items:</strong></p>
              <ul style="margin: 5px 0 0 0; padding-left: 20px; color: #666;">
                ${orderDetails.items.map(item => `<li>${item.quantity}x ${item.bottleSize}</li>`).join('')}
              </ul>
              <p style="margin: 10px 0 0 0; color: #666;"><strong>Total:</strong> Rs ${orderDetails.totalPrice}</p>
              <p style="margin: 10px 0 0 0; color: #666;"><strong>Delivery Address:</strong> ${orderDetails.deliveryAddress}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">You'll receive another email when your order is out for delivery.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:3000/customer/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">Track Your Order</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 AquaFlow. All rights reserved.</p>
          </div>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Order confirmation email sent to:', customerEmail);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};

// Send order status update email
exports.sendOrderStatusUpdate = async (customerEmail, customerName, orderId, status, workerName) => {
    try {
        let statusMessage = '';
        let statusColor = '#667eea';

        if (status === 'assigned') {
            statusMessage = `Your order has been assigned to ${workerName}. They'll be delivering soon!`;
            statusColor = '#4facfe';
        } else if (status === 'in-transit') {
            statusMessage = `Your order is on the way! ${workerName} is heading to your location.`;
            statusColor = '#f093fb';
        } else if (status === 'delivered') {
            statusMessage = 'Your order has been delivered successfully! Thank you for choosing AquaFlow.';
            statusColor = '#11998e';
        }

        const mailOptions = {
            from: `AquaFlow <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: `📦 Order Update - ${status.toUpperCase()} - AquaFlow`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: ${statusColor}; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">💧 AquaFlow</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Order Status Update</h2>
            <p style="color: #666; font-size: 16px;">Hi ${customerName},</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid ${statusColor};">
              <p style="margin: 0; color: #666; font-size: 16px;"><strong>Order ID:</strong> #${orderId.slice(-6)}</p>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 16px;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status.toUpperCase()}</span></p>
              ${workerName ? `<p style="margin: 10px 0 0 0; color: #666;"><strong>Delivery Worker:</strong> ${workerName}</p>` : ''}
            </div>
            
            <p style="color: #666; font-size: 16px;">${statusMessage}</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:3000/customer/dashboard" style="background: ${statusColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">View Order Details</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 AquaFlow. All rights reserved.</p>
          </div>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Status update email sent to:', customerEmail);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};

// Send password reset email
exports.sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
    try {
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        const mailOptions = {
            from: `AquaFlow <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: '🔐 Reset Your Password - AquaFlow',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">💧 AquaFlow</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #666; font-size: 16px;">Hi ${userName},</p>
            <p style="color: #666; font-size: 16px;">You requested to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #667eea; font-size: 14px; word-break: break-all;">${resetUrl}</p>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-size: 14px;">⚠️ This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 AquaFlow. All rights reserved.</p>
          </div>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent to:', userEmail);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};

module.exports = exports;
