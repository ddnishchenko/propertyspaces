/* import { SES } from 'aws-sdk';

// The character encoding for the email.
const charset = 'UTF-8';

// Specify a configuration set. If you do not want to use a configuration
// set, comment the following variable, and the
// ConfigurationSetName : configuration_set argument below.
const configuration_set = "testing";

// Replace sender@example.com with your "From" address.
// This address must be verified with Amazon SES.
const sender = 'Lidarama Developer <ddnishchenko.itera@gmail.com>';

const ses = new SES();

export function sendEmail(params) {
  // Specify the parameters to pass to the API.
  const options = {
    Source: sender,
    Destination: {
      ToAddresses: [
        ...params.recipients
      ],
    },
    Message: {
      Subject: {
        Data: params.subject,
        Charset: charset
      },
      Body: {
        Text: {
          Data: params.bodyText,
          Charset: charset
        },
        Html: {
          Data: params.bodyHtml,
          Charset: charset
        }
      }
    },
    ConfigurationSetName: configuration_set
  };
  ses.sendEmail(options).promise();
}
 */

import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

// If you're using Amazon SES in a region other than US West (Oregon),
// replace email-smtp.us-west-2.amazonaws.com with the Amazon SES SMTP
// endpoint in the appropriate AWS Region.
const smtpEndpoint = "email-smtp.us-west-2.amazonaws.com";

// The port to use when connecting to the SMTP server.
const port = 465;

// Replace sender@example.com with your "From" address.
// This address must be verified with Amazon SES.
const senderAddress = "Lidarama Developer <ddnishchenko.itera@gmail.com>";

// Create the SMTP transport.
let transporter = createTransport({
  host: smtpEndpoint,
  port: port,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export function sendEmail(params: Mail.Options) {

  // Specify the fields in the email.
  let mailOptions: Mail.Options = {
    from: senderAddress,
    ...params
  };

  // Send the email.
  return transporter.sendMail(mailOptions);

}



