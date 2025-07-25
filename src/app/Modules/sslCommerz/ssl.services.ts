import { envVars } from "../../../config/env";
import { AppError } from "../../Error/appError";
import { ISslCommerz } from "./ssl.interfaces";
import Axios from "axios";
import httpsStatus from "http-status-codes";

const sslPaymentInit = async (payload: ISslCommerz) => {
  try {
    const data = {
      store_id: envVars.SSL.SSL_STORE_ID,
      store_passwd: envVars.SSL.SSL_STORE_PASSWORD,

      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      shipping_method: "Qourier",
      product_name: "Tour Booking",
      product_category: "Tour",
      product_profile: "Tour Booking",
      num_of_item: 1,
      shipping_cost: 0,
      success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?tran_id=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?tran_id=${payload.transactionId}&amount=${payload.amount}&status=fail`,
      cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?tran_id=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.phone,
      cus_fax: "N/A",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "1000",
      ship_country: "Bangladesh",
      multi_card_name: "N/A",
      value_a: "N/A",
      value_b: "N/A",
      value_c: "N/A",
      value_d: "N/A",
    };

    const response = await Axios.post(envVars.SSL.SSL_PAYMENT_API, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error initializing SSL payment:", error);
    throw new AppError(
      httpsStatus.INTERNAL_SERVER_ERROR,
      "Failed to initialize SSL payment"
    );
  }
};

export const SslServices = {
  sslPaymentInit,
};
