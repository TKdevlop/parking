import express from 'express';
import mongoose from 'mongoose';
import routes from './routes';
const port = 5000;
const app = express();

app.use(express.json());
app.use('/parking', routes);
(async () => {
  await mongoose.connect('mongodb://localhost:27017/parking', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(port, () => {
    console.log(`Server is on port ${port}`);
  });
})();
