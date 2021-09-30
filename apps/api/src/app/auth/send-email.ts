import { SES } from 'aws-sdk';

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



