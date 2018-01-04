import jwt from 'jsonwebtoken';
import _ from 'lodash';

export const createTokens =
  async(user, secret) => {
    const createToken = jwt.sign({
        user: _.pick(user, ['id', 'displayName', 'emails']),
      },
      secret, {
        expiresIn: '7d',
      },
    );

    const createRefreshToken = jwt.sign({
        user: _.pick(user, ['id', 'displayName', 'emails']),
      },
      secret, {
        expiresIn: '30d',
      },
    );

    return Promise.all([createToken, createRefreshToken]);

  };


export const refreshTokens = async(token, refreshToken, models, SECRET) => {
  let userEmail = 0;
  let userDisplayName = '';
  try {
    const {
      user: {
        emails,
        displayName,
      },
    } = jwt.decode(refreshToken);
    userEmail = emails[0].value;
    userDisplayName = displayName;
  } catch (err) {
    return {};
  }

  if (!userEmail) {
    return {};
  }

  const user = await models.User.findOne({
    where: {
      email: userEmail,
    },
    raw: true,
  });

  if (!user) {
    return {};
  }
  user.displayName = userDisplayName;
  const [newToken, newRefreshToken] = await createTokens(user, SECRET);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};
