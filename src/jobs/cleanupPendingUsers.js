const cron = require("node-cron");
const Shop = require("../models/shop.model");

const cleanupPendingUsers = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const result = await Shop.deleteMany({
        status: "pending",
        createdAt: { $lt: cutoff },
      });

      console.log(`Cleaned up ${result.deletedCount} stale pending shops`);
    } catch (err) {
      console.error("Error cleaning up pending shops:", err);
    }
  });
};

module.exports = cleanupPendingUsers;
