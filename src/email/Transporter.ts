import * as nodemailer from "nodemailer"

import * as dotenv from "dotenv"

dotenv.config()

console.log(process.env.EMAIL,process.env.EMAIL_PASSWORD)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
   user: 'wikimedic.noreply@gmail.com',
   pass: 'a'
  }
  });


  /* var mailOptions = {
    from: 'your-email@gmail.com',
    to: 'receiver-email@gmail.com',
    subject: 'Test Email',
    text: 'Hello, this is a test email!'
   };
   
   transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
   }); */

const to = "deoliveiradiasandre@gmail.com"

var mailOptions = {
    from : process.env.EMAIL,
    to : to,
    subject : 'Test Email',
    text : "Email de Teste da Wikimedic"
}

transporter.sendMail(mailOptions, function(error, info){
    if(error)
    {
        console.log(error)
    }
    else
    {
        console.log(info)
    }
})