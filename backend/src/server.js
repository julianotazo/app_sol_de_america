import { app } from './app.js';
import { env } from './config/env.js';

app.listen(Number(env.PORT), () => {
  console.log(`API escuchando en http://localhost:${env.PORT}`);
});
