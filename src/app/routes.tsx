import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import RiskTagsConfig from "./components/pages/RiskTagsConfig";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: RiskTagsConfig },
      { path: "otc-risk-tags", Component: RiskTagsConfig },
      { path: "*", Component: RiskTagsConfig },
    ],
  },
]);