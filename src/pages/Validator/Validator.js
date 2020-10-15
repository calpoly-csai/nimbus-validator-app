import React, { useState, useEffect } from "react";
import "./Validator.scss";
import ValidatorForm from "./ValidatorForm";
import ValidatorQueryNav from "./ValidatorQueryNav";
import AllValidated from "./AllValidated";
import axios from "axios";

export default function Validator(props) {
  let maxQueryQueueSize = 10;
  let [queries, setQueries] = useState([]);
  let [selectedIndex, setSelectedIndex] = useState(0);

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
    const nonSpacedToken = /((?<=(\w))(?=(\[)))|((?<=(\]))(?=(\w)))/g

    // update query in the database
    let data = {
      id: submittedQuery.id,
      isAnswerable: submittedQuery.isAnswerable === "No" ? false : true,
      type: submittedQuery.type,
      question: submittedQuery.question.replace(regex, "").replace(nonSpacedToken, " "),
      answer: submittedQuery.answer.replace(regex, "").replace(nonSpacedToken, " "),
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
      return {
        question: query.question_format,
        answer: query.answer_format,
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
    </div>
  );
}
