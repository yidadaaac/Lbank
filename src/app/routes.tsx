import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import RiskTagsConfig from "./components/pages/RiskTagsConfig";
import BlacklistManagement from "./components/pages/BlacklistManagement";
import OTCRiskTags from "./components/pages/OTCRiskTags";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: RiskTagsConfig },
      { path: "otc-risk-tags", Component: OTCRiskTags },
      { path: "blacklist", Component: BlacklistManagement },
      { path: "*", Component: RiskTagsConfig },
    ],
  },
]);