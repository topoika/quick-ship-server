import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export interface Email {
	to: string;
	from: string;
	subject: string;
	html: string;
}

interface EmailAuth {
	user: string;
	pass: string;
}

interface EmailConfig {
	host: string;
	port: string;
	auth: EmailAuth;
}

function createTransporter(config: any) {
	let transporter = nodemailer.createTransport(config);
	return transporter;
}

const defaultConfig: EmailConfig = {
	host: process.env.SMTP_HOST!,
	port: process.env.SMTP_PORT!,
	auth: {
		user: process.env.FROM_EMAIL!,
		pass: process.env.EMAIL_PASS!,
	},
};

const sendEmail = async (email: Email) => {
	const transporter = createTransporter(defaultConfig);
	await transporter.verify();
	await transporter.sendMail(email);
};

export default sendEmail;