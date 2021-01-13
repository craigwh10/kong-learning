import express, { Request, Response } from 'express';
const bodyParser = require('body-parser');
const app = express();

const clients: Clients = [
  {
    id: 1,
    first_name: 'Haha',
    last_name: 'Hehe'
  },
  {
    id: 2,
    first_name: 'Lala',
    last_name: 'Lili'
  }
];

interface Client {
    id: number,
    first_name: string,
    last_name: string
}

type Clients = Client[];

app.use(bodyParser.json());

app.get('/api/v1/clients', (req: Request, res: Response<Clients>): void => {
  res.json(clients);
});

app.get('/api/v1/clients/:id', (req: Request, res: Response<Client>): void => {
  const id: number = parseInt(req.params.id);
  res.json(clients[id]);
});

app.listen(10001, () => {
  console.log(`[CLIENT] Client service started!`);
});