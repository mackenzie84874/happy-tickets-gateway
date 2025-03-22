
import React from "react";
import { Link } from "react-router-dom";

const DashboardFooter: React.FC = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-muted-foreground">
        Need help using the admin dashboard? Check the <Link to="#" className="text-primary hover:underline">documentation</Link>.
      </p>
    </div>
  );
};

export default DashboardFooter;
