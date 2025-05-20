export const environments = {
  usersTableName: process.env.USERS_DYNAMODB_TABLE_NAME || 'users',
  awsRegion: process.env.AWS_REGION || 'us-west-1',
  saltRounds: process.env.SALT_ROUNDS || 10,
};
