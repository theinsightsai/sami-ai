"use client";

import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Collapse, Fade, Grow, Slide, Zoom, Box } from "@mui/material";

const positionStyles = {
  "top-left": { transformOrigin: "0 0 0" },
  "top-right": { transformOrigin: "top right" },
  top: { transformOrigin: "top" },
  "bottom-left": { transformOrigin: "bottom left" },
  "bottom-right": { transformOrigin: "bottom right" },
  bottom: { transformOrigin: "bottom" },
};

const Transitions = forwardRef(
  ({ children, position = "top-left", type = "grow", direction = "up", ...others }, ref) => {
    const positionSX = positionStyles[position] || positionStyles["top-left"];

    return (
      <Box ref={ref}>
        {type === "grow" && (
          <Grow {...others} timeout={{ appear: 0, enter: 150, exit: 150 }}>
            <Box sx={positionSX}>{children}</Box>
          </Grow>
        )}

        {type === "collapse" && (
          <Collapse {...others} sx={positionSX}>
            {children}
          </Collapse>
        )}

        {type === "fade" && (
          <Fade {...others} timeout={{ appear: 0, enter: 300, exit: 150 }}>
            <Box sx={positionSX}>{children}</Box>
          </Fade>
        )}

        {type === "slide" && (
          <Slide {...others} timeout={{ appear: 0, enter: 150, exit: 150 }} direction={direction}>
            <Box sx={positionSX}>{children}</Box>
          </Slide>
        )}

        {type === "zoom" && (
          <Zoom {...others}>
            <Box sx={positionSX}>{children}</Box>
          </Zoom>
        )}
      </Box>
    );
  }
);

export default Transitions;

export const PopupTransition = forwardRef((props, ref) => <Zoom ref={ref} timeout={200} {...props} />);

Transitions.propTypes = {
  children: PropTypes.node,
  position: PropTypes.oneOf([
    "top-left",
    "top-right",
    "top",
    "bottom-left",
    "bottom-right",
    "bottom",
  ]),
  type: PropTypes.oneOf(["grow", "collapse", "fade", "slide", "zoom"]),
  direction: PropTypes.oneOf(["up", "right", "left", "down"]),
};
