import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { FeedbackPageCopy } from "./screens/FeedbackPageCopy";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <FeedbackPageCopy />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
