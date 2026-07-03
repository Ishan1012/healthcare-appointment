import { createTransport } from "nodemailer";

const transporter = createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
    logger: true
})

export default transporter;