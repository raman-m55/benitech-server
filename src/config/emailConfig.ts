import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.c1.liara.email',
  port: 587,
  secure: false,
  auth: {
    user: 'stoic_raman_v1oag4',
    pass: 'ef58741c-ceac-4e68-a021-0a2297bce544',
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Mail server is Running');
  }
});

export default transporter;
