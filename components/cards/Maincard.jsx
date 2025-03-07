"use client";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

// Header styles
const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow = false,
      children,
      content = true,
      contentSX = {},
      darkTitle,
      elevation = 0,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
      <Card
        ref={ref}
        elevation={elevation}
        {...others}
        sx={{
          border: border ? "1px solid" : "none",
          borderRadius: 2,
          borderColor: isDarkMode ? theme.palette.divider : "lightgray",
          boxShadow: boxShadow ? shadow || theme.shadows[1] : "none",
          ":hover": {
            boxShadow: boxShadow ? shadow || theme.shadows[2] : "none",
          },
          "& pre": {
            m: 0,
            p: "16px !important",
            fontFamily: theme.typography.fontFamily,
            fontSize: "0.75rem",
          },
          ...sx,
        }}
      >
        {/* Card Header */}
        {title && (
          <CardHeader
            sx={headerSX}
            title={
              darkTitle ? (
                <Typography variant="h3">{title}</Typography>
              ) : typeof title === "string" ? (
                <Typography variant="subtitle1">{title}</Typography>
              ) : (
                title
              )
            }
            action={secondary}
          />
        )}

        {/* Card Content */}
        {content ? <CardContent sx={contentSX}>{children}</CardContent> : children}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  elevation: PropTypes.number,
  secondary: PropTypes.any,
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default MainCard;
