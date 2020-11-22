import React, { useState, useEffect } from "react";
import "./Validator.scss";
import ValidatorForm from "./ValidatorForm";
import ValidatorQueryNav from "./ValidatorQueryNav";
import AllValidated from "./AllValidated";
import NotificationStack from "../../components/NotificationStack/NotificationStack";
import axios from "axios";

export default function Validator(props) {
  let maxQueryQueueSize = 10;
  let [queries, setQueries] = useState([]);
  let [selectedIndex, setSelectedIndex] = useState(0);
  let [notifications, setNotifications] = useState([])

  let handleNotificationExpiration = (id) => {
    let index = notifications.findIndex(n => n.timestamp === id)
    if (index === -1) return;
    console.log("Notification handled");
    const newNotifications = [...notifications]
    newNotifications.splice(index,1); // Pop from the end of the queue, which is the front of the array
    
    setNotifications(newNotifications);
  }

  let addNotification = () => {
    let options = [
      {timestamp: Date.now(),
        title: "Message sent",
      message: "The server recieved your update",
    color: "green"},
    {timestamp: Date.now(),
      title: "Something went wrong",
    message: "Please ask someone who knows about this stuff, cuz I don't",
  color: "red"},
  {timestamp: Date.now(),
    title: "Message deleted",
  message: "Message was deleted on the server successfully",
color: "blue"}
    ]
    const chooseRandom = (arr) => arr[Math.floor(Math.random() * (arr.length - 1))]
    const newNotifications = [...notifications, chooseRandom(options)]

  setNotifications(newNotifications);
  }


  let deleteCurrentQuery = async () => {
    let updatedQueries = [...queries];
    let data = updatedQueries.splice(selectedIndex, 1)[0];

    // delete query in database
    axios.post(`/new_data/delete_phrase`, data);

    // If we have fallen below 2 queries remaining, fetch 3 more.
    if (updatedQueries.length < 2) await fetchMoreQueries(3, updatedQueries);
    else setQueries(updatedQueries);

    if (selectedIndex >= updatedQueries.length)
      setSelectedIndex(updatedQueries.length - 1);
  };

  let getNextQuery = async (submittedQuery) => {
    //update local version of the submitted query
    let updatedQueries = [...queries];
    submittedQuery.validated = true;
    updatedQueries[selectedIndex] = submittedQuery;

    // regex to remove anything between HTML entities (potential HTML elements)
    let regex = /&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});.*&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});/gi;
    // Ensures that all tokens have spaces between their dividers and the words following or preceding.
    const nonSpacedToken = /((?<=(\w))(?=(\[)))|((?<=(\]))(?=(\w)))/g 
    // Takes out non breaking space that allows users to edit before tokens that start off the textbox.
    const firstTokenSpacer = /^&nbsp;/g 
    const formatString = str => {
      return str.replace(firstTokenSpacer, "").replace(regex, "").replace(nonSpacedToken, " ").trim()
    }

    // update query in the database
    let data = {
      id: submittedQuery.id,
      isAnswerable: submittedQuery.isAnswerable === "No" ? false : true,
      type: submittedQuery.type,
      question: formatString(submittedQuery.question),
      answer: formatString(submittedQuery.answer),
      verified: true,
    };
    
    await axios.post(`/new_data/update_phrase`, data);

    if (updatedQueries.length - 2 <= selectedIndex)
      await fetchMoreQueries(1, updatedQueries);
    else setQueries(updatedQueries);

    //Shift to next query
    setSelectedIndex((i) => i + 1);
  };

  let fetchMoreQueries = async (count, currentQueries) => {
    console.log("fetching");
    let dequeueCount = Math.max(
      count + currentQueries.length - maxQueryQueueSize,
      0
    );
    let updatedQueries = currentQueries.slice(dequeueCount);
    // TODO: get the actual server address
    let response = await axios.get(`/data/get_phrase/${count}`);
    response = response.data.data.map((query) => {
      const question = (query.question_format[0] === "[" ? "&nbsp;"  : "") + query.question_format
      const answer = (query.answer_format[0] === "[" ? "&nbsp;"  : "") + query.answer_format
      return {
        question,
        answer,
        type: query.answer_type,
        isAnswerable: query.can_we_answer,
        id: query.id,
        validated: false,
      };
    });
    updatedQueries.push(...response);
    setQueries(updatedQueries);
    //Adjust the selected index
    setSelectedIndex((i) => i - dequeueCount);
  };
  useEffect(() => {
    fetchMoreQueries(3, queries);
    /** DO NOT REMOVE THE COMMENT BELOW! It prevents an error from being raised 
     * that is caused by the empty dependency array in useEffect here. 
     * https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: Build a loading page while queries are initially fetched
  if (!queries.length) return <AllValidated />;

  return (
    <div className="ValidatorPage">
      <h1 className="title">Validate</h1>
      <ValidatorForm
        query={queries[selectedIndex]}
        onDelete={deleteCurrentQuery}
        onSubmit={getNextQuery}
      />
      <ValidatorQueryNav
        queries={queries}
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      />
      <NotificationStack notifications={notifications} onNotificationExpired={handleNotificationExpiration}/>
      <button onClick={addNotification} style={{position: "fixed", bottom: "20px", right: "20px", padding: "10px 15px"}}>Notify</button>
    </div>
  );
}
