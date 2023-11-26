import * as nodemailer from "nodemailer"

import * as dotenv from "dotenv"

dotenv.config()

//console.log(process.env.EMAIL,process.env.EMAIL_PASSWORD)
export const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port : 587,
  secure: false,
  auth: {
   user: process.env.EMAIL,
   pass: process.env.EMAIL_PASSWORD
  }
});


/* var mailOptions = {
    from : "wikimedic_no_reply@hotmail.com",
    to : ,
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
}) */