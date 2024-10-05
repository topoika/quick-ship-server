import db from "../../db/models";
import { validateUser } from "../middlewares/auth.middleware";
import catchAsync from "../utils/catchAsync";
import { walletAtr } from "./data.attributes";

/**
 * @route GET /data/faqs
 */
const getFAQs = catchAsync(async (req: any, res) => {
  const faqs = await db.faqs.findAll();
  res.status(200).json({
    status: 200,
    success: true,
    message: "FAQs retrieved successfully",
    data: faqs,
  });
});

/**
 * @route GET /data/feeds
 */
const getFeeds = catchAsync(async (req: any, res) => {
  const feeds = await db.feeds.findAll();
  res.status(200).json({
    status: 200,
    success: true,
    message: "Feeds retrieved successfully",
    data: feeds,
  });
});

/**
 * @route GET /data/home-user-stats
 */
const getHomeUserStats = catchAsync(async (req: any, res) => {
  const user: any = await validateUser(req.user.id);
  const wallet = await db.wallets.findOne({
    where: { id: user.walletId },
    attributes: walletAtr,
  });
  res.status(200).json({
    status: 200,
    success: true,
    message: "Home user stats retrieved successfully",
    data: wallet,
  });
});

/**
 * @route GET /data/user-notifications
 */
const getUserNotifications = catchAsync(async (req: any, res) => {
  const user = await validateUser(req.user.id);
  const notifications = await db.notifications.findAll({
    where: { userId: user.id },
  });
  res.status(200).json({
    status: 200,
    success: true,
    message: "Notifications retrieved successfully",
    data: notifications,
  });
});

export { getFAQs, getFeeds, getHomeUserStats, getUserNotifications };
