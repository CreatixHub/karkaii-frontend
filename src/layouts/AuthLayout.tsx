

import { Outlet, useLocation } from "react-router";
import { useBootstrapTooltips } from "@hooks/useBootstrapTooltips";

const AuthFeature = () => {
  const location = useLocation();
  useBootstrapTooltips(location.pathname);

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthFeature;
