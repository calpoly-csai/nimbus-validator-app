import React, {useState, useEffect} from "react";
import "./NotificationStack.scss"
var CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');


function NotificationCard({color, title, message}) {
    const cardStyles = {backgroundColor:color}
    return <div className="NotificationCard" style={cardStyles}>
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
}


export default function NotificationStack({onNotificationExpired, notifications}) {
    const [notificationTimeouts, setNotificationTimeouts] = useState([{timestamp: Date.now()}])
    useEffect(() => {
        const timeouts = []
        const duration = 3000
        notifications.forEach(notification => {
           let to = setTimeout(() => {
               console.log(notification.timestamp + " finished")
                onNotificationExpired(notification.timestamp)
            },  Math.max((notification.timestamp + duration) - Date.now(), 0))
            timeouts.push(to)
        })
        setNotificationTimeouts(timeouts)
        
        return () => notificationTimeouts.forEach(to => clearTimeout(to))
    }, [notifications])

    return  <div className="NotificationStack">
        <CSSTransitionGroup
    transitionName="example"
    >
        {notifications.map(notification => <NotificationCard {...notification}/>)}
    </CSSTransitionGroup>
    </div>

    
}