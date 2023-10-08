import axios from "axios";
import crypto from "crypto";

import {
  GOGATEWAY_TOKEN,
  GOGATEWAY_TOKEN_ALGORITHM,
  GOGATEWAY_BACKEND_URL,
} from "../secrets/env.js";

const webhook = async (req, res) => {
  try {
    const { id, txnId, amount } = req.body.data;

    const preparedString = `${id}:${txnId}:${amount}`;

    const signature = crypto
      .createHmac(GOGATEWAY_TOKEN_ALGORITHM, GOGATEWAY_TOKEN)
      .update(preparedString)
      .digest("hex");

    if (signature !== req.headers.signature) throw new Error("Wrong signature"); // verify signature

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(403).json({ msg: error.message || "Internal Server Error" });
  }
};

const createPayment = async () => {
  try {
    const { data } = await axios.post(
      `${GOGATEWAY_BACKEND_URL}/api/v4/payment/create`,
      {
        amountIn: 500,
        currency: "EUR",
        paymentMethod: "QIWIVISAMASTER",
        creditCard: "2200220022002200",
        email: "test@gmail.com",
        lang: "ru",
      },
      {
        headers: {
          "GOGATEWAY-V4-TOKEN": GOGATEWAY_TOKEN,
        },
      }
    );

    console.log(data);

    res.status(200);
  } catch (err) {
    console.log(err.response.data);
    res.json(400);
  }
};

export { webhook, createPayment };
