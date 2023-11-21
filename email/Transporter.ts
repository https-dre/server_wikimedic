import * as nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "gmail",
    auth: {
        user: "no-reply@diegopinho.com",
        pass: "senhaqualquerdeteste"
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