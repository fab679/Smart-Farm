import axios from "axios";
import unirest from "unirest";

const Timestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hour = ("0" + date.getHours()).slice(-2);
  const minute = ("0" + date.getMinutes()).slice(-2);
  const second = ("0" + date.getSeconds()).slice(-2);
  return year + month + day + hour + minute + second;
};

const url = "http://7da4-2c0f-fe38-2243-52eb-2997-51b4-de38-35f0.ngrok.io/pay";

declare global {
  var safaricom: string;
}

export async function MpesaAuth() {
  return await new Promise(async (resolve, reject) => {
    await axios
      .get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          auth: {
            username: "Azs2KejU1ARvIL5JdJsARbV2gDrWmpOB",
            password: "hipGvFJbOxri330c",
          },
          params: {
            grant_type: "client_credentials",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        global.safaricom = res.data.access_token;
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

export async function register_url() {
  await MpesaAuth();
  return await new Promise((resolve, reject) => {
    axios
      .post(
        "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",
        {
          ShortCode: 600992,
          ResponseType: "Completed",
          ConfirmationURL: `${url}/confirmation`,
          ValidationURL: `${url}/validation`,
        },
        {
          headers: {
            Authorization: `Bearer ${global.safaricom}`,
          },
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function mpesaExpress(
  amount: number,
  phone: number,
  access_token: string
): Promise<any> {
  var timestamp = Timestamp();
  console.log(phone, typeof phone, amount);
  const password = btoa(
    174379 +
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
      timestamp
  );
  return await new Promise(async (resolve, reject) => {
    await axios
      .post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: 174379,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phone,
          PartyB: 174379,
          PhoneNumber: phone,
          CallBackURL: `${url}/stkcallback`,
          AccountReference: "Smart Farm",
          TransactionDesc: "Payment for Smart Farm",
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const C2B = async (phone: number, amount: number) => {
  const auth: any = await MpesaAuth();

  return await new Promise((resolve, reject) => {
    unirest(
      "POST",
      "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest"
    )
      .headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth?.access_token}`,
      })
      .send(
        JSON.stringify({
          InitiatorName: "testapi",
          SecurityCredential:
            "ILXsWUrsG/6konrlsic1amoMbCiOCJF7IhY9ZGiz2GCbW4JtmfHsS69AgyzwhRRVNT8Ghwq6JsChfFbb61Hh4YkE8+dZt7CCUy2mhgxX2Ign2/+PvzgThZ1lNcy5Pt4zNdSkEq1QuYeIRWLQSPQE/CAA64mFzCYKeWeuJc4Z2mlov18EdHbgG1B1SaoDkmxrJG5c3T8Di2Oaog58M5mwxY/J2G4uEacd52ZKMxIggaXEE/n+7oKjbotSpgrokjTH3lMFcrAu64fbKrKv7OlQSs7ZArENCopFsvGZULc1Dzd9uPgkChrqdkslePzaEStBT9gxuIdzVio3PExpy1KNdg==",
          CommandID: "BusinessPayment",
          Amount: amount,
          PartyA: 600982,
          PartyB: phone,
          Remarks: "Test remarks",
          QueueTimeOutURL: `${url}/b2c/queue`,
          ResultURL: `${url}/b2c/result`,
          Occassion: "",
        })
      )
      .end((res: any) => {
        if (res?.error) reject(res?.error);
        resolve(res?.raw_body);
      });
  });
};
