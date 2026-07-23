import React from "react";

interface Notification {
  id: number;
  message: string;
  type: "success" | "info" | "warning" | "error";
  time: string;
}

interface Props {
  notifications: Notification[];
}

const NotificationCenter: React.FC<Props> = ({
  notifications,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">

      <h2 className="text-xl font-bold mb-5">
        🔔 Notifications
      </h2>

      {notifications.length === 0 ? (

        <p className="text-slate-500">
          No notifications
        </p>

      ) : (

        notifications.map((notification) => (

          <div
            key={notification.id}
            className="bg-slate-800 rounded-lg p-4 mb-3"
          >

            <div className="flex justify-between">

              <span
                className={`font-medium ${
                  notification.type === "success"
                    ? "text-green-400"
                    : notification.type === "warning"
                    ? "text-yellow-400"
                    : notification.type === "error"
                    ? "text-red-400"
                    : "text-blue-400"
                }`}
              >
                {notification.message}
              </span>

              <span className="text-xs text-slate-500">
                {notification.time}
              </span>

            </div>

          </div>

        ))

      )}

    </div>
  );
};

export default NotificationCenter;