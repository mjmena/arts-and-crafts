import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './data/schema.js';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './webpack.config';

var graphql_server = express();
graphql_server.use("/", graphqlHTTP({
    schema: schema,
    graphiql: true,
    prettify: true
}));

graphql_server.listen(8081, function() {
    console.log('GraphQL server running on port https://localhost:8080');
});

new WebpackDevServer(webpack(config), {
  stats: 'errors-only',
  publicPath: config.output.publicPath,
  proxy: {'/graphql': 'http://localhost:8081'},
  hot: true,
  historyApiFallback: true
}).listen(8080, process.env.IP, function (err, result) {
  if (err) {
    console.log(err);
  }
  
  console.log('Listening at localhost:8080');
});