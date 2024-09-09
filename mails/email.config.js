import { MailtrapClient } from 'mailtrap';
import { envVariables } from '../config/envVariables.js';

const client = new MailtrapClient({
  token: envVariables.MAILTRAP_TOKEN,
});

const sender = {
  email: 'mailtrap@demomailtrap.com',
  name: 'Natours App',
};

export { client, sender };
