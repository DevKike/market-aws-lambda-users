export const environments = {
  usersTableName: process.env.USERS_DYNAMODB_TABLE_NAME || 'users',
  awsRegion: process.env.AWS_REGION || 'us-west-1',
  saltRounds: process.env.SALT_ROUNDS || 10,
  jwtSecretKey: process.env.JWT_SECRET_KEY || 'exampleSecretKey',
  tokenExpiration: Number(process.env.JWT_TOKEN_EXPIRATION) || 604800,
};
