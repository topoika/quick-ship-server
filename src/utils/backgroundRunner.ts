import Logger from "../logger";
import cron from "node-cron";

export const setupEventExpireBackgroundRunner = () => {
  try {
    cron.schedule("* * * * *", () => {
      Logger.info(`====================================== `);
      Logger.info("CRON Running: '* * * * *'");
      Logger.info("CRON Ending: '* * * * *'");
      Logger.info(`====================================== `);
    });
  } catch (error: any) {
    Logger.error("Failed to run schedule ", error.message);
  }
};
