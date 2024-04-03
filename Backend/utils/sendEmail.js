import nodemailer from "nodemailer"

const sendEmail = async(ways)=>{
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        }
      });


      const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to : ways.email,
        subject: ways.subject,
        html: ways.message,
      };


      await transport.sendMail(message);
};

export default sendEmail;