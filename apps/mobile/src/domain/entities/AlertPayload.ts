import type { AlertChannel, AlertTrigger } from "../valueObjects/AlertTypes";

export interface AlertPayload {
  channel: AlertChannel;
  message: string;
  trigger: AlertTrigger;
}
