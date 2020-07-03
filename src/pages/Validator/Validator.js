import React, { useState, useEffect } from "react";
import "./Validator.scss";
import ValidatorForm from "./ValidatorForm";
import TokenBar from "./TokenBar";
import ValidatorQueryNav from "./ValidatorQueryNav";
import AllValidated from "./AllValidated";
import axios from "axios";

import SignOut from "../../components/SignOut/SignOut";

export default function Validator(props) {
  let maxQueryQueueSize = 10;
  let [queries, setQueries] = useState([]);
  let [selectedIndex, setSelectedIndex] = useState(0);

  let deleteCurrentQuery = async () => {
    let updatedQueries = [...queries];
    updatedQueries.splice(selectedIndex, 1);

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
    // TODO: get the actual server addrss
    let response = await axios.get(
      `http://0.0.0.0:8080/data/get_phrase/${count}`
    );
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
      <TokenBar />
      <ValidatorQueryNav
        queries={queries}
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      />
    </div>
  );
}
