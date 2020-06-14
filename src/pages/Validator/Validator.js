import React, { useState } from "react";
import "./Validator.scss";
import ValidatorForm from "./ValidatorForm";
import TokenBar from "./TokenBar";
import ValidatorQueryNav from "./ValidatorQueryNav";
import AllValidated from "./AllValidated";

import SignOut from "../../components/SignOut/SignOut";

export default function Validator(props) {
  let maxQueryQueueSize = 10;
  let [queries, setQueries] = useState([
    {
      question: "What is {Professor} email",
      answer: "{Professor}  will communicate to you with his mind.",
      type: "fact",
      isAnswerable: false,
      id: 1,
      validated: false,
    },
    {
      question: "Lorem {ipsum}",
      answer: "something {else}",
      type: "other",
      isAnswerable: true,
      id: 2,
      validated: false,
    },
    {
      question: "What is {Professor Braggarts} email",
      answer: "Idk but he sure thinks he's {cool}.",
      type: "related",
      isAnswerable: false,
      id: 3,
      validated: false,
    },
  ]);

  let [selectedIndex, setSelectedIndex] = useState(0);

  let deleteCurrentQuery = () => {
    let updatedQueries = [...queries];
    updatedQueries.splice(selectedIndex, 1);
    if (queries.length < 3) fetchMoreQueries(3);
    if (selectedIndex >= updatedQueries.length)
      setSelectedIndex(updatedQueries.length - 1);
    setQueries(updatedQueries);
  };

  let getNextQuery = (submittedQuery) => {
    //update local version of the submitted query
    let updatedQueries = [...queries];
    submittedQuery.validated = true;
    updatedQueries[selectedIndex] = submittedQuery;
    setQueries(updatedQueries);

    if (queries.length - 2 <= selectedIndex) fetchMoreQueries(1);

    //Shift to next query
    setSelectedIndex((i) => i + 1);
  };

  let fetchMoreQueries = (count) => {
    console.log("fetching");
    let dequeueCount = Math.max(count + queries.length - maxQueryQueueSize, 0);
    let updatedQueries = queries.slice(dequeueCount);
    //Actually fetch the queries here This is for testing purposes
    let response = new Array(count).fill({
      question: "This is from the {server}",
      answer: "That is so {cool}",
      type: "other",
      isAnswerable: true,
      id: 2,
    });
    //End test
    response = response.map((query) => {
      query.validated = false;
      return query;
    });
    updatedQueries.push(...response);
    setQueries(updatedQueries);
    //Adjust the selected index
    setSelectedIndex((i) => i - dequeueCount);
  };
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
