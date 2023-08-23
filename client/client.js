const grpc = require('@grpc/grpc-js');
// eslint-disable-next-line import/no-extraneous-dependencies
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = '../server/news.proto';

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const { NewsService } = grpc.loadPackageDefinition(packageDefinition);

const client = new NewsService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
);

module.exports = client;
