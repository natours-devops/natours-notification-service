const nodemailer = require("nodemailer");

class Email {
  constructor(to, firstName, url) {
    this.to = to;
    this.firstName = firstName;
    this.url = url;
    this.from = `Natours <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        secure: true,
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject, html) {
    await this.newTransport().sendMail({
      from: this.from,
      to: this.to,
      subject,
      html,
      text: html.replace(/<[^>]*>/g, ""),
    });
  }

  async sendWelcome() {
    const html = `
      <div style="font-family:'Lato',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#777">
        <div style="background:linear-gradient(to right bottom,#7dd56f,#28b487);padding:30px;text-align:center;border-radius:4px 4px 0 0">
          <img src="https://natours.dev/img/logo-white.png" alt="Natours" style="height:40px"/>
        </div>
        <div style="background:#f7f7f7;padding:40px;border-radius:0 0 4px 4px">
          <h1 style="font-size:22px;font-weight:700;color:#333;margin-bottom:20px">Welcome to the Natours Family, ${this.firstName}!</h1>
          <p style="font-size:16px;line-height:1.6;margin-bottom:20px">We're glad to have you on board. Start exploring our amazing tours.</p>
          <a href="${this.url}" style="display:inline-block;background:#55c57a;color:#fff;padding:14px 30px;border-radius:100px;text-decoration:none;font-size:16px;font-weight:700;text-transform:uppercase;margin-bottom:20px">Get started</a>
        </div>
      </div>`;
    await this.send("Welcome to the Natours Family!", html);
  }

  async sendPasswordReset() {
    const html = `
      <div style="font-family:'Lato',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#777">
        <div style="background:linear-gradient(to right bottom,#7dd56f,#28b487);padding:30px;text-align:center;border-radius:4px 4px 0 0">
          <img src="https://natours.dev/img/logo-white.png" alt="Natours" style="height:40px"/>
        </div>
        <div style="background:#f7f7f7;padding:40px;border-radius:0 0 4px 4px">
          <h1 style="font-size:22px;font-weight:700;color:#333;margin-bottom:20px">Password Reset Request</h1>
          <p style="font-size:16px;line-height:1.6;margin-bottom:20px">Hi ${this.firstName}, click below to reset your password. Valid for <strong>10 minutes</strong>.</p>
          <a href="${this.url}" style="display:inline-block;background:#55c57a;color:#fff;padding:14px 30px;border-radius:100px;text-decoration:none;font-size:16px;font-weight:700;text-transform:uppercase;margin-bottom:20px">Reset my password</a>
          <p style="font-size:14px;color:#999;margin-top:30px">If you didn't request this, please ignore this email.</p>
        </div>
      </div>`;
    await this.send("Your password reset token (valid for 10 minutes)", html);
  }

  async sendBookingConfirmation(tourName, price) {
    const html = `
      <div style="font-family:'Lato',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#777">
        <div style="background:linear-gradient(to right bottom,#7dd56f,#28b487);padding:30px;text-align:center;border-radius:4px 4px 0 0">
          <img src="https://natours.dev/img/logo-white.png" alt="Natours" style="height:40px"/>
        </div>
        <div style="background:#f7f7f7;padding:40px;border-radius:0 0 4px 4px">
          <h1 style="font-size:22px;font-weight:700;color:#333;margin-bottom:20px">Booking Confirmed!</h1>
          <p style="font-size:16px;line-height:1.6;margin-bottom:20px">Hi ${this.firstName}, your booking for <strong>${tourName}</strong> has been confirmed.</p>
          <p style="font-size:16px;line-height:1.6;margin-bottom:20px">Amount paid: <strong>$${price}</strong></p>
          <a href="${this.url}" style="display:inline-block;background:#55c57a;color:#fff;padding:14px 30px;border-radius:100px;text-decoration:none;font-size:16px;font-weight:700;text-transform:uppercase;margin-bottom:20px">View my bookings</a>
        </div>
      </div>`;
    await this.send("Your Natours booking is confirmed!", html);
  }
}

module.exports = Email;
