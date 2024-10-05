import axios from "axios";
import base64 from "base-64";
import * as dotenv from "dotenv";
import Logger from "../../logger";
import db from "../../db/models";
import catchAsync from "../utils/catchAsync";

dotenv.config();

const DARAJA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const DARAJA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const SHORTCODE = process.env.SHORTCODE;
const LIPA_NA_MPESA_PASSKEY = process.env.LIPA_NA_MPESA_PASSKEY;
const CALLBACK_URL = process.env.CALLBACK_URL;
const COMPANY_NAME = process.env.COMPANY_NAME;

const getAccessToken = async (): Promise<string> => {
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = base64.encode(
    `${DARAJA_CONSUMER_KEY}:${DARAJA_CONSUMER_SECRET}`
  );

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error: any) {
    throw new Error("Failed to get access token: " + error.message);
  }
};
const getTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const encodePassword = (
  shortcode: any,
  passkey: any,
  timestamp: any
): string => {
  const password = `${shortcode}${passkey}${timestamp}`;
  return Buffer.from(password).toString("base64");
};

// initiate STK push with M-Pesa DARAJA API
const initiateSTKPush = async (phoneNumber: string, amount: number) => {
  const timestamp = getTimestamp();
  const password = encodePassword(SHORTCODE, LIPA_NA_MPESA_PASSKEY, timestamp);
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      JSON.stringify({
        BusinessShortCode: SHORTCODE,
        PartyA: phoneNumber,
        Timestamp: timestamp,
        PartyB: SHORTCODE,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        Password: password,
        PhoneNumber: phoneNumber,
        CallBackURL: CALLBACK_URL,
        AccountReference: COMPANY_NAME,
        TransactionDesc: `Pay ${amount} for your package shipment`,
      }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.errorMessage || "An error occurred during STK Push"
    );
  }
};
/**
 * @route POST /transaction/mpesa-callback
 * @description endpoint to receive a callback from mpesa
 */
const mpesaCallback = catchAsync(async (req: any, res) => {
  const callbackData = req.body;
  const resultCode = callbackData?.Body?.stkCallback?.ResultCode;
  if (resultCode === 0) {
    const mpesaReceiptNumber =
      callbackData?.Body?.stkCallback?.CallbackMetadata?.Item?.find(
        (item: any) => item.Name === "MpesaReceiptNumber"
      )?.Value;
    const payment = await db.payments.findOne({
      where: {
        referenceNumber: callbackData?.Body?.stkCallback?.CheckoutRequestID,
      },
    });
    payment.status = "completed";
    payment.mpesaReceiptNumber = mpesaReceiptNumber;
    await payment.save();
    Logger.info(
      "Transaction successful. M-Pesa Receipt Number:",
      mpesaReceiptNumber
    );
  } else {
    const payment = await db.payments.findOne({
      where: {
        referenceNumber: callbackData?.Body?.stkCallback?.CheckoutRequestID,
      },
    });
    payment.status = "failed";
    await payment.save();
    Logger.error("Transaction failed. ResultCode:", resultCode);
  }
  res.status(200).json({
    message: "Callback received",
  });
});

export { initiateSTKPush, mpesaCallback };
