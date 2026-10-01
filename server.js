const app = require("./src/app");
const connectDB = require("./src/config/db");

if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(process.env.PORT || 3000, () => {
        console.log("Server is running");
      });
    })
    .catch((error) => {
      console.error("Database connection failed", error);
      process.exit(1);
    });
}

module.exports = app;
