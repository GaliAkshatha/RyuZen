import React from "react";
import Card from "./../../shared/components/Card"

function UDashboard() {
  return(
        <div className="grid grid-cols-3 gap-5">

      {/* LEFT */}
      <div className="col-span-2 flex flex-col gap-5">

        <Card title="Activities + Description" className="h-60" />
        

        <Card title="Attendance" className="h-60" />
        <Card title="News Zone" className="h-40" />

      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-5">
        <Card title="Leaderboard (Game)" className="h-60" />
        <Card title="Leaderboard (Academic)" className="h-60" />
      </div>

    </div>
  );
}

export default UDashboard;