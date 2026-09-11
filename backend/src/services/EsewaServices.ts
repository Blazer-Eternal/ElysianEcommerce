import crypto from "crypto";
import { esewaConfig } from "../config";

export interface EsewaPaymentFields {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export class EsewaServices {
  private generateSignature(message: string): string {
    const hmac = crypto.createHmac("sha256", esewaConfig.secretKey);
    hmac.update(message);
    return hmac.digest("base64");
  }

  public buildPaymentFields(transactionUuid: string, totalAmount: number): EsewaPaymentFields {
    const amount = totalAmount.toFixed(2);
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const message = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${esewaConfig.productCode}`;
    const signature = this.generateSignature(message);

    return {
      amount,
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: transactionUuid,
      product_code: esewaConfig.productCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: esewaConfig.successUrl,
      failure_url: esewaConfig.failureUrl,
      signed_field_names: signedFieldNames,
      signature,
    };
  }

  public gatewayUrl(): string {
    return esewaConfig.gatewayUrl;
  }

  // Independently re-verifies the transaction with eSewa's own status API,
  // rather than trusting the redirect payload alone — this is what actually
  // confirms payment, since a client-side redirect can be spoofed.
  public async verifyTransaction(transactionUuid: string, totalAmount: number): Promise<boolean> {
    const amount = totalAmount.toFixed(2);
    const url = `${esewaConfig.statusCheckUrl}?product_code=${esewaConfig.productCode}&total_amount=${amount}&transaction_uuid=${transactionUuid}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.status === "COMPLETE";
    } catch (error) {
      console.error("eSewa verification error:", error);
      return false;
    }
  }
}