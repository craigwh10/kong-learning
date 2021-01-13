const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const customers = [
  {
    id: 5,
    first_name: 'Dodol',
    last_name: 'Dargombez'
  },
  {
    id: 6,
    first_name: 'Nyongot',
    last_name: 'Gonzales'
  }
];

app.use(bodyParser.json());

app.get('/api/v1/customers', (req, res) => {
  res.json(customers);
});

app.get('/api/v1/customers/:id', (req, res) => {
  res.json(customers[req.params.id]);
});

app.listen(10000, () => {
  console.log(`[CUSTOMER] Customer service started!`);
});