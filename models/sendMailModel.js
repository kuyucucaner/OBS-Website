const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        // SMTP ayarlarınızı buraya ekleyin
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'tahacanokuyucu@gmail.com',
            pass: 'yjvroxdsrqokigmz',
        },
    });

    try {
        const info = await transporter.sendMail({
            from: 'tahacanokuyucu@gmail.com',
            to,
            subject,
            text,
        });

        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = {sendEmail};