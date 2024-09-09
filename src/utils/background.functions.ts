import * as admin from "firebase-admin";
import Logger from "../logger";
import db from "../db/models";

const sendUnsendNotification = async () => {
  try {
    const unsendNotifications = await db.notifications.findAll({
      where: {
        isSend: false,
      },
    });

    if (unsendNotifications.length === 0) {
      Logger.info("No unsent notifications found.");
      return;
    }
    const promises = unsendNotifications.map(async (item: any) => {
      const topic = `cllan_${item.cllanId}`;
      const commonInfo = {
        title: "New Ad Posted on Auto Cllan",
        body: item.content,
      };

      const message = {
        notification: commonInfo,
        data: {
          ...commonInfo,
          type: "cllan",
          itemId: `${item.cllanId}`,
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
          { isSend: true },
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
