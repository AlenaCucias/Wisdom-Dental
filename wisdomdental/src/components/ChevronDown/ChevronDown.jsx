
import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const ChevronDown = ({
  size,
  className,
  img = "https://c.animaapp.com/khMdpB74/img/size-20@2x.png",
}) => {
  return (
    <img
      className={`chevron-down ${size} ${className}`}
      alt="Size"
      src={
        size === "sixteen"
          ? "https://c.animaapp.com/khMdpB74/img/size-16@2x.png"
          : size === "twenty"
            ? img
            : size === "twenty-four"
              ? "https://c.animaapp.com/khMdpB74/img/size-24@2x.png"
              : size === "thirty-two"
                ? "https://c.animaapp.com/khMdpB74/img/size-32@2x.png"
                : size === "forty"
                  ? "https://c.animaapp.com/khMdpB74/img/size-40@2x.png"
                  : "https://c.animaapp.com/khMdpB74/img/size-48@2x.png"
      }
    />
  );
};

ChevronDown.propTypes = {
  size: PropTypes.oneOf([
    "sixteen",
    "twenty-four",
    "forty-eight",
    "twenty",
    "thirty-two",
    "forty",
  ]),
  img: PropTypes.string,
};