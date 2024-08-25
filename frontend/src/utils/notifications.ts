// utils/notifications.ts
import { notification } from "antd";

export const showErrorNotification = (message: string, description: string) => {
  notification.error({
    message,
    description,
    placement: "topRight",
  });
};

export const showSuccessNotification = (
  message: string,
  description: string
) => {
  notification.success({
    message,
    description,
    placement: "topRight",
  });
};
