import {
  graphqlExpress,
  graphiqlExpress,
} from 'apollo-server-express';
import {
  makeExecutableSchema,
} from 'graphql-tools';

import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';
import {
  createTokens,
  refreshTokens,
} from './auth';

const app = express();
const SECRET = 'elpistor';
const SECRET2 = 'elobed';

passport.use(new GoogleStrategy({
    clientID: '711526008376-luogluhf7p7a0joqki4jv26v35tun87v.apps.googleusercontent.com',
    clientSecret: '1lVr2cRbWSR2VJWqS-fJV2f8',
    callbackURL: 'https://6f5c69d9.ngrok.io/auth/google/callback',
  },
  async(accessToken, refreshToken, profile, cb) => {
    if (await models.User.findOne({
        where: {
          email: profile.emails[0].value,
        },
      })) {
      models.User.findOne({
        where: {
          email: profile.emails[0].value,
        },
      }).then((usr) => profile.id = usr.id).then(() => cb(null, profile));
    } else {
      cb(null, false);
    }
  }
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
  async(req, res) => {
    const [token, refreshToken] = await createTokens(req.user, SECRET);
    res.redirect(`http://localhost:4200/login?token=${token}&refreshToken=${refreshToken}`);
  },
);

const addUser = async(req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const {
        user,
      } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET,
      );
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  } else if (!token) {
    res.status(500).send({
      error: 'Not authenticated',
    });
  }
  next();
};

const gqschema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use(cors('*'));

app.use(addUser);

app.use('/graphql', bodyParser.json(), graphqlExpress(req => ({
  schema: gqschema,
  context: {
    models,
    user: req.user,
  },
})));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

models.sequelize.sync().then(() => app.listen(3000));
