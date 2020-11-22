import React, {useState, useEffect} from "react";
import "./NotificationStack.scss"
var CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');


function NotificationCard({color, title, message, timestamp, onClick}) {
    const cardStyles = {borderColor:color}
    return <div className="NotificationCard" style={cardStyles} onClick={onClick}>
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
}


export default function NotificationStack({onNotificationExpired, notifications}) {
    const [notificationTimeouts, setNotificationTimeouts] = useState([{timestamp: Date.now()}])

    useEffect(() => {
        notificationTimeouts.forEach(to => clearTimeout(to))
        const timeouts = []
        const duration = 10000;
        notifications.forEach(notification => {
           let to = setTimeout(() => {
               console.log(notification.timestamp + " finished")
                onNotificationExpired(notification.timestamp)
            },  Math.max((notification.timestamp + duration) - Date.now(), 0))
            timeouts.push(to)
        })
        setNotificationTimeouts(timeouts)
        
    }, [notifications])

    // function handleClickDismissal(timestamp) {
    //     onNotificationExpired(timestamp);
    //     let newTimeouts = [...notificationTimeouts]
        
    // }

    return  <div className="NotificationStack">
        <CSSTransitionGroup
    transitionName="example"
    >
        {notifications.map(notification => <NotificationCard {...notification} key={notification.timestamp} onClick={() => onNotificationExpired(notification.timestamp)}/>)}
    </CSSTransitionGroup>
    </div>

    
}