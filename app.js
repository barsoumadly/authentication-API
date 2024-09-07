import express from 'express';

import { envVariables } from './config/envVariables.js';
import connectToDatabase from './database/connectToDatabase.js';
import authRoutes from './routes/auth.routes.js';
import veiwRoutes from './routes/view.routes.js';

const app = express();
const port = envVariables.PORT;

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.json());
app.use(express.static('./public'));

app.use('/api/v1/auth', authRoutes);
app.use(veiwRoutes);

app.listen(port, async function () {
  try {
    await connectToDatabase();
    console.log(`Server is running on port: ${port}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
});
