import db from "../db/models";
import * as admin from "firebase-admin";
import Logger from "../logger";

const sendUnsendNotification = async () => {
  try {
    const unsendNotifications = await db.notifications.findAll({
      where: {
        isSent: false,
      },
    });
    if (unsendNotifications.length === 0) {
      Logger.info("No unsent notifications found.");
      return;
    }
    const promises = unsendNotifications.map(async (item: any) => {
      const topic = `user_${item.userId}`;
      const commonInfo = {
        title: item.title,
        body: item.body,
      };
      const message = {
        notification: commonInfo,
        data: {
          ...commonInfo,
          type: item.type,
          itemId: `${item.itemId}`,
        },
        android: {
          notification: {
            sound: "notifications_sound",
          },
        },
        topic,
      };
      try {
        const response = await admin.messaging().send(message);
        await db.notifications.update(
          { isSent: true },
          { where: { id: item.id } }
        );
        Logger.info(
          `Successfully sent message for notification ID ${item.id}:`,
          response
        );
      } catch (error) {
        Logger.error(
          `Error sending message for notification ID ${item.id}:`,
          error
        );
      }
    });
    await Promise.all(promises);
  } catch (error) {
    Logger.error("Error fetching unsent notifications:", error);
  }
};

export { sendUnsendNotification };
