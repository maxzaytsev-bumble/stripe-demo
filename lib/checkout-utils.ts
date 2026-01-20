import type {
  CheckoutResponse,
  HostedCheckoutResponse,
  CustomCheckoutResponse,
} from "./types";

/**
 * Type guard for hosted checkout response
 */
export function isHostedCheckoutResponse(
  response: CheckoutResponse,
): response is HostedCheckoutResponse {
  return "url" in response;
}

/**
 * Type guard for custom checkout response
 */
export function isCustomCheckoutResponse(
  response: CheckoutResponse,
): response is CustomCheckoutResponse {
  return (
    "client_secret" in response &&
    "mode" in response &&
    typeof response.mode === "string"
  );
}
