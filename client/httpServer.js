/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');

const debug = require('debug')('client:httpServer');
const client = require('./client');

const port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/news', (req, res) => {
  client.getAllNews({}, (err, news) => {
    if (err) res.status(500).send(err);
    res.send(news);
  });
});

app.get('/news/:id', (req, res) => {
  debug('GET /news: ', req.params);
  client.getNews(req.params, (err, news) => {
    if (err) res.status(500).send(err);
    res.send(news);
  });
});

app.post('/news', (req, res) => {
  debug('POST /news: ', req.body);
  // eslint-disable-next-line no-unused-vars
  client.addNews(req.body, (err, _news) => {
    if (err) res.status(500).send(err);
    res.status(200).end();
  });
});

app.put('/news/:id', (req, res) => {
  debug(`PUT /news/${req.params.id} ${JSON.stringify(req.body)}`);
  req.body.id = req.params.id;
  client.editNews(req.body, (err, news) => {
    if (err) res.status(500).send(err);
    res.send(news);
  });
});

app.delete('/news/:id', (req, res) => {
  debug(`PUT /news/${req.params.id}`);
  // eslint-disable-next-line no-unused-vars
  client.deleteNews(req.params, (err, news) => {
    if (err) res.status(500).send(err);
    res.status(200).end();
  });
});

// const server = http.createServer(requestListener);
app.listen(port, () => {
  debug(`running @  http://localhost:${port}`);
});
