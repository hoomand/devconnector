module.exports = {
  mongoURI: `mongodb+srv://${process.env.DB_USERNAME}:${
    process.env.DB_PASSWORD
  }@devconnector-vjyw5.mongodb.net/test?retryWrites=true&w=majority`
};
