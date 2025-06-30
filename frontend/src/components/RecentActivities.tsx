import React, { useState, useEffect } from "react";
import { Baby, Heart } from "lucide-react";
import "../styles/RecentActivities.css";

interface Activity {
  id: string;
  type: 'birth' | 'death';
  name: string;
  date: Date;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface RecentActivitiesProps {
  onActivityClick?: (activity: Activity) => void;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ onActivityClick }) => {
  const [dateFilter, setDateFilter] = useState<string>("");
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: "1",
        type: "birth",
        name: "John Doe",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: Baby,
        color: "text-success"
      },
      {
        id: "2",
        type: "death",
        name: "Jane Smith",
        date: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        icon: Heart,
        color: "text-danger"
      },
      {
        id: "3",
        type: "birth",
        name: "Mike Johnson",
        date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        icon: Baby,
        color: "text-success"
      }
    ];
    setRecentActivities(mockActivities);
  }, []);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return "Just now";
    }
  };

  const handleActivityClick = (activity: Activity) => {
    if (onActivityClick) {
      onActivityClick(activity);
    }
    console.log("Activity clicked:", activity);
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
  };

  const filteredActivities = dateFilter 
    ? recentActivities.filter(activity => {
        const activityDate = activity.date.toISOString().split('T')[0];
        return activityDate === dateFilter;
      })
    : recentActivities;

  return (
    <div className="card">
      <div className="card-header">
        <div className="recent-activities-header">
          <h5 className="card-title mb-0">Recent Activities</h5>
          <input
            type="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="form-control recent-activities-date-input"
          />
        </div>
      </div>
      <div className="card-body">
        <div className="recent-activities-content">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="recent-activity-item"
                onClick={() => handleActivityClick(activity)}
              >
                <activity.icon className={`recent-activity-icon ${activity.color}`} />
                <div>
                  <p className="recent-activity-text">
                    {activity.type === 'birth' ? 'New birth registered' : 'New death registered'}
                  </p>
                  <p className="recent-activity-subtext">
                    {activity.name} - {formatTimeAgo(activity.date)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="recent-activities-empty">
              {dateFilter ? "No activities found for selected date" : "No recent activities"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
