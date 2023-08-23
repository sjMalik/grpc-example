const grpc = require('@grpc/grpc-js');

const PROTO_PATH = './news.proto';
// eslint-disable-next-line import/no-extraneous-dependencies
const protoLoader = require('@grpc/proto-loader');

const debug = require('debug')('server:grpcServer');

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const newsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
const news = {
  news: [
    {
      id: '1', title: 'Note 1', body: 'Content 1', postImage: 'Post image 1',
    },
    {
      id: '2', title: 'Note 2', body: 'Content 2', postImage: 'Post image 2',
    },
  ],
};

server.addService(newsProto.NewsService.service, {
  getAllNews: (_, callback) => {
    callback(null, news);
  },
  addNews: (call, callback) => {
    debug('addNews Method ', call.request);
    const addNews = { id: Date.now(), ...call.request };
    news.news.push(addNews);
    callback(null, addNews);
  },
  deleteNews: (_, callback) => {
    const newsId = _.request.id;
    news.news = news.news.filter(({ id }) => id !== newsId);
    callback(null, {});
  },
  editNews: (call, callback) => {
    debug('getNews method: ', call.request);
    const newsId = call.request.id;
    const newsItem = news.news.find(({ id }) => id === newsId);
    debug(newsItem);
    if (newsItem) {
      newsItem.body = call.request.body;
      newsItem.title = call.request.title;
      newsItem.postImage = call.request.postImage;
      callback(null, newsItem);
    } else {
      callback({
        code: 404,
        messgge: 'News not found',
      }, {});
    }
  },
  getNews: (_, callback) => {
    debug('getNews method: ', _.request);
    const newsId = _.request.id;
    const newsItem = news.news.find(({ id }) => id === newsId);
    callback(null, newsItem);
  },
});

server.bindAsync(
  '127.0.0.1:50051',
  grpc.ServerCredentials.createInsecure(),
  // eslint-disable-next-line no-unused-vars
  (error, port) => {
    debug('Server running at http://127.0.0.1:50051');
    server.start();
  },
);
