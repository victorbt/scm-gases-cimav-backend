import jwt from 'jsonwebtoken';
import _ from 'lodash';

const userproto = {
  id: 5,
  name: 'elpistor',
  email: 'elpistor@hotmail.com',
};


export const createTokens = async(user, secret, secret2) => {

  const createToken = jwt.sign({
      user: _.pick(userproto, ['id', 'name']),
    },
    secret, {
      expiresIn: '1m',
    },
  );

  const createRefreshToken = jwt.sign({
      user: _.pick(userproto, 'id'),
    },
    secret2, {
      expiresIn: '7d',
    },
  );

  return Promise.all([createToken, createRefreshToken]);
};
