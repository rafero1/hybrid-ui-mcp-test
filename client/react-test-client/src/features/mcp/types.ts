import type { ProgressNotificationParams } from "@modelcontextprotocol/sdk/types";

export type OnProgressUpdate = (
  notificationParams: ProgressNotificationParams,
) => void;

export type ToolCallbacks = {
  onProgressUpdate?: OnProgressUpdate;
};

export type ProgressListenerCallback = (
  notificationParams: ProgressNotificationParams,
) => void;

export type TextResponseContent = {
  type: "text";
  text: string;
};
