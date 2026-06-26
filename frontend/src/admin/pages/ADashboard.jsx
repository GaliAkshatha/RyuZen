import React,{useEffect, useState} from "react";
import Card from "../../shared/components/Card";
import Leaderboard from "../../shared/components/Leaderboard";

function ADashboard(){
    const [activities, setActivities] = useState([]);

    useEffect(()=> {
      fetchActivities();
    },[]);

    async function fetchActivities() {
      try {
        const response =
          await fetch(
            "http://localhost:5000/api/activities"
          );
        
        const data =
          await response.json();
        
        setActivities(data);
      }catch(error){
        console.log(error);
      }
    }    
    return(
        <div className="grid grid-cols-3 gap-5">

      {/* LEFT */}
      <div className="col-span-2 flex flex-col gap-5">

        <Card title="Activities" className="min-h-[250px]" >
        <div className="space-y-3 mt-4">
          {
            activities
              .slice(0, 5)
              .map((activity) => (

                <div 
                  key={activity._id}
                  className="
                    flex justify-between
                    items-center
                    border-b
                    border-white/10
                    pb-2
                  "
                >
                  <div>

                    <p className="font-medium">
                      {activity.title}
                    </p>

                    <p className="
                      text-xs
                      text-white/50
                    ">
                      {activity.type}
                    </p>
                  </div>

                  <span
                    className="
                      text-cyan-400
                      text-sm
                    "
                  >
                    +{activity.points}
                  </span>
                </div>
              ))
          }
        </div>
        </Card>
        <Card title="Attendance" className="h-60" />
        <Card title="News Zone" className="h-40" />

      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-5">
        <Card title="Leaderboard (Game)" className="h-60" />
        <Card title="Leaderboard (Academic)" 
        className="h-[500px] overflow-y-auto" >
          <Leaderboard />
        </Card>
      </div>

    </div>
    ); 
}

export default ADashboard;