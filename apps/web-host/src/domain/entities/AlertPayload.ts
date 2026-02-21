import type {
  AlertChannel,
  AlertTrigger,
} from "@/domain/valueObjects/AlertTypes";

export interface AlertPayload {
  channel: AlertChannel;
  message: string;
  trigger: AlertTrigger;
}
