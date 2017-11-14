import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';

import {
  graphqlExpress,
  graphiqlExpress,
} from 'apollo-server-express';
import {
  makeExecutableSchema,
} from 'graphql-tools';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';

const app = express();

passport.use(new GoogleStrategy({
    clientID: '711526008376-luogluhf7p7a0joqki4jv26v35tun87v.apps.googleusercontent.com',
    clientSecret: '1lVr2cRbWSR2VJWqS-fJV2f8',
    callbackURL: 'https://bee7ab3b.ngrok.io/auth/google/callback',
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    console.log(profile.emails[0].value);
    cb(null, {});
  },
));

app.use(passport.initialize());

app.get(
  '/login',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  (req, res) => {
    // res.send('AuthWAS GOOD');
    res.redirect('http://localhost:4200/home?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ');
  },
);

const gqschema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use(cors('*'));

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: gqschema,
  context: {
    models,
  },
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

models.sequelize.sync().then(() => app.listen(3000));
