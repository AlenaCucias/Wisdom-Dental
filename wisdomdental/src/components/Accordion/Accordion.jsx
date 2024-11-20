import PropTypes from "prop-types";
import React from "react";
import { useReducer } from "react";
import { AccordionItem } from "../AccordionItem";
import "./style.css";

export const Accordion = ({
  stateProp,
  className,
  accordionItemTitle = "Question",
}) => {
  const [state, dispatch] = useReducer(reducer, {
    state: stateProp || "default",
  });

  return (
    <div
      className={`accordion ${className}`}
      onClick={() => {
        dispatch("click");
      }}
    >
      <AccordionItem
        accordionContentClassName={`${state.state === "open" && "class-6"}`}
        accordionTitleClassName={`${state.state === "default" && "class-3"}`}
        bodyClassName={`${state.state === "open" && "class-7"}`}
        chevronDownSize={
          state.state === "default"
            ? "https://c.animaapp.com/khMdpB74/img/chevron-down-6@2x.png"
            : undefined
        }
        chevronUp={
          state.state === "open"
            ? "https://c.animaapp.com/khMdpB74/img/chevron-up@2x.png"
            : undefined
        }
        className={`${state.state === "open" ? "class" : "class-2"}`}
        content={state.state === "open" ? "Answer" : undefined}
        divClassName={`${state.state === "default" && "class-5"}`}
        divClassNameOverride={`${state.state === "open" && "class-4"}`}
        state={state.state === "open" ? "open" : "closed"}
        title={accordionItemTitle}
      />
    </div>
  );
};

function reducer(state, action) {
  if (state.state === "default") {
    switch (action) {
      case "click":
        return {
          state: "open",
        };
    }
  }

  if (state.state === "open") {
    switch (action) {
      case "click":
        return {
          state: "default",
        };
    }
  }

  return state;
}

Accordion.propTypes = {
  stateProp: PropTypes.oneOf(["open", "default"]),
  accordionItemTitle: PropTypes.string,
};
