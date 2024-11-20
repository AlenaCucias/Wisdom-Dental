import PropTypes from "prop-types";
import React from "react";
import { ChevronDown } from "../ChevronDown";
import "./style.css";

export const AccordionItem = ({
  content = "Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.",
  title = "Title",
  state,
  className,
  accordionTitleClassName,
  divClassName,
  chevronDownSize = "https://c.animaapp.com/khMdpB74/img/size-20@2x.png",
  divClassNameOverride,
  chevronUp = "https://c.animaapp.com/khMdpB74/img/chevron-up-1@2x.png",
  accordionContentClassName,
  bodyClassName,
}) => {
  return (
    <div className={`accordion-item ${state} ${className}`}>
      {state === "open" && (
        <>
          <div className="accordion-title">
            <div className={`text-wrapper ${divClassNameOverride}`}>
              {title}
            </div>

            <img className="chevron-up" alt="Chevron up" src={chevronUp} />
          </div>

          <div className={`accordion-content ${accordionContentClassName}`}>
            <p className={`body ${bodyClassName}`}>{content}</p>
          </div>
        </>
      )}

      {state === "closed" && (
        <div className={`div ${accordionTitleClassName}`}>
          <div className={`text-wrapper ${divClassName}`}>{title}</div>

          <ChevronDown
            className="chevron-down-instance"
            img={chevronDownSize}
            size="twenty"
          />
        </div>
      )}
    </div>
  );
};

AccordionItem.propTypes = {
  content: PropTypes.string,
  title: PropTypes.string,
  state: PropTypes.oneOf(["closed", "open"]),
  chevronDownSize: PropTypes.string,
  chevronUp: PropTypes.string,
};