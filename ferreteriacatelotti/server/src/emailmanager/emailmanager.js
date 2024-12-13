import nodemailer from 'nodemailer';

export class EmailManager{
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: "dmnferreteria@gmail.com",
                pass: "meye zouo whtl fwbw"
            }
        });
    }

    async sendEmailNewUser(username, useremail) {
        try {
            const emailOptions = {
                from: 'Ferreteria Catelotti <dmnferreteria@gmail.com>',
                to: useremail,
                subject: 'Registro de usuario',
                html: `<h1>Bienvenido a Ferretería Catelotti, ${username}</h1>`,
            };
    
            await this.transporter.sendMail(emailOptions);
            console.log('Correo enviado con éxito');
        } catch (error) {
            console.error('Error al enviar el correo de bienvenida:', error);
            throw new Error('No se pudo enviar el correo de bienvenida');
        }
    }
    

    async sendRestorationEmail(email, username, token){
        try {
            const mailOptions = {
                from: 'coderhouse50015@gmail.com',
                to: email,
                subject: 'Restablecimiento de Contraseña',
                html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${username},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="http://localhost:5173/cambiarcontraseña">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar correo electrónico:", error);
            throw new Error("Error al enviar correo electrónico");
        }
    }
    
    
}