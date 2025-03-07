"use client";
import { Fragment } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { FONT_STYLES } from "@/constants";

const CustomFilter = ({
  FILTER_ARRAY,
  handleCrossIcon,
  filterValue,
  setFilterValue,
}) => {
  return (
    <div className="grid grid-cols-1 mt-7 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {FILTER_ARRAY.map((fieldObj, i) => (
        <Fragment key={`${i}-${fieldObj.id}`}>
          {fieldObj.component === "SELECT" && (
            <FormControl
              fullWidth
              key={`${i}-${fieldObj.id}`}
              sx={{ position: "relative" }}
            >
              <InputLabel id={fieldObj.id}>{fieldObj.label}</InputLabel>
              <Select
                labelId={fieldObj.id}
                id={fieldObj.id}
                value={filterValue[fieldObj.id] || ""}
                label={fieldObj.label}
                onChange={(event) =>
                  setFilterValue((prev) => ({
                    ...prev,
                    [fieldObj.id]: event.target.value,
                  }))
                }
              >
                {fieldObj.options.map((opt, idx) => (
                  <MenuItem
                    key={idx}
                    value={opt.value}
                    style={{ ...FONT_STYLES }}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              <CloseIcon
                onClick={(event) => handleCrossIcon(event, fieldObj.id)}
                fontSize="small"
                className="absolute right-8 bottom-6 text-gray-500 cursor-pointer"
              />
            </FormControl>
          )}

          {fieldObj.component === "INPUT" && (
            <FormControl
              fullWidth
              key={`${i}-input`}
              sx={{ position: "relative" }}
            >
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="search"
                label="Search (By Action & IP Address)"
                name="search"
                autoComplete="search"
                autoFocus
                onChange={(event) =>
                  setFilterValue((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
                value={filterValue.search || ""}
                style={{ ...FONT_STYLES, marginTop: "0px" }}
              />
              <CloseIcon
                onClick={(event) => handleCrossIcon(event, fieldObj.id)}
                fontSize="small"
                className="absolute right-8 bottom-6 text-gray-500 cursor-pointer"
              />
            </FormControl>
          )}
        </Fragment>
      ))}
    </div>
  );
};
export default CustomFilter;
