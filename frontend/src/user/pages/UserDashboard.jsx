import React,{useEffect,useState} from "react";
import { useLocation } from "react-router-dom";
import Card from "./../../shared/components/Card"

function UDashboard() {
      const [activities, setActivities] = useState([]);
      const [notifications, setNotifications] = useState([]);
      const location = useLocation();
  
      useEffect(()=> {
         console.log("UDashboard Mounted");
        fetchActivities();
        fetchNotifications();
      },[location.pathname]);
  
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

      async function fetchNotifications() {

        try {

          const user =
            JSON.parse(
              localStorage.getItem("user")
            );

          const response =
            await fetch(
            `http://localhost:5000/api/notifications/${user.id}`
          );

           const data =
            await response.json();

            console.log(data);

          setNotifications(
            data.notifications || []
          );

        } catch (error) {

           console.log(error);

        }

      }
      console.log("Notifications State:", notifications);
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
        
        <Card title="Notifications" className="min-h-[250px]" >
        <div className="space-y-3 mt-4">
          {
            notifications.length === 0 ? (
              <p className="text-white/50">
                No Notifications
              </p>
             ) : (
              notifications
              .slice(0,5)
              .map((notification)=>(
                <div 
                   key={notification._id}
                   className="
                    border-b
                    border-white/10
                    pb-2
                    "
                  >
                    <p className="font-medium">
                      {notification.title}
                    </p>

                    <p
                      className="
                        text-xs
                        text-white/50
                        "
                    >
                      {notification.message}
                    </p>
                </div>
              ))
             )
          }

        </div>
        </Card>

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