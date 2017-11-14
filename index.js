import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import {
  createTokens
} from './auth'

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
    callbackURL: 'https://01e87598.ngrok.io/auth/google/callback',
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    console.log(profile.emails[0].value);
    cb(null, profile);
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
    res.send(req.user);
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
