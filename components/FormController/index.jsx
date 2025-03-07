"use client";
import {
  TextField,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  OutlinedInput,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { FONT_STYLES, PRIMARY_COLOR } from "@/constants";

const ErrorSection = ({ touched, errors, fieldObj }) => {
  return (
    <>
      {touched?.[fieldObj?.id] && errors?.[fieldObj?.id] ? (
        <FormHelperText
          style={{
            display: "flex",
            justifyContent: "end",
            fontStyle: "italic",
          }}
        >
          {errors[fieldObj?.id]}
        </FormHelperText>
      ) : (
        <FormHelperText style={{ visibility: "hidden" }}>text</FormHelperText>
      )}
    </>
  );
};

const FormController = ({
  fieldObj,
  values,
  touched,
  errors,
  setFieldValue,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDown = (event) => event.preventDefault();

  return (
    <>
      {fieldObj?.component === "TEXT" && (
        <TextField
          key={fieldObj?.id}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id={fieldObj.id}
          label={fieldObj.label}
          name={fieldObj.id}
          autoComplete={fieldObj.id}
          onChange={(event) => setFieldValue(fieldObj.id, event.target.value)}
          autoFocus
          value={values?.[fieldObj.id]}
          error={touched?.[fieldObj.id] && Boolean(errors?.[fieldObj.id])}
          helperText={
            <ErrorSection
              fieldName={fieldObj.id}
              touched={touched}
              errors={errors}
            />
          }
          style={{ marginTop: "2px", ...FONT_STYLES }}
        />
      )}
      {fieldObj?.component === "PASSWORD" && (
        <TextField
          key={fieldObj?.id}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name={fieldObj.id}
          label={fieldObj.label}
          type={showPassword ? "text" : "password"}
          id={fieldObj.id}
          autoComplete={fieldObj.id}
          onChange={(event) => setFieldValue(fieldObj.id, event.target.value)}
          value={values?.[fieldObj.id]}
          error={touched?.[fieldObj.id] && Boolean(errors?.[fieldObj.id])}
          helperText={
            <ErrorSection
              fieldName={fieldObj.id}
              touched={touched}
              errors={errors}
            />
          }
          sx={{ marginTop: "0px" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDown}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          style={{ ...FONT_STYLES }}
        />
      )}
      {fieldObj?.component === "CUSTOM_TEXT" && (
        <FormControl
          sx={{
            mt: 5,
            width: "70%",
            marginTop: "12px",
          }}
          key={fieldObj?.id}
          error={touched?.[fieldObj.id] && Boolean(errors?.[fieldObj.id])}
        >
          <InputLabel htmlFor={fieldObj.id} sx={{ color: PRIMARY_COLOR }}>
            {fieldObj.label} <span style={{ color: "red" }}>*</span>
          </InputLabel>
          <OutlinedInput
            id={fieldObj.id}
            startAdornment={
              <div className="border-r border-gray-300 pr-2 mr-2">
                <InputAdornment position="start">
                  {fieldObj.icon}
                </InputAdornment>
              </div>
            }
            name={fieldObj.id}
            autoComplete={fieldObj.id}
            onChange={(event) => setFieldValue(fieldObj.id, event.target.value)}
            autoFocus
            type="text"
            value={values?.[fieldObj.id]}
            label={`${fieldObj.label} *`}
            style={{ marginTop: "2px", ...FONT_STYLES }}
            sx={{
              borderRadius: "7px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: PRIMARY_COLOR,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: PRIMARY_COLOR,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: PRIMARY_COLOR,
              },
            }}
          />
          <ErrorSection touched={touched} errors={errors} fieldObj={fieldObj} />
        </FormControl>
      )}
      {fieldObj?.component === "CUSTOM_PASSWORD" && (
        <FormControl
          sx={{
            mt: 5,
            width: "70%",
            marginTop: "12px",
          }}
          key={fieldObj?.id}
          error={touched?.[fieldObj.id] && Boolean(errors?.[fieldObj.id])}
        >
          <InputLabel htmlFor={fieldObj.id} sx={{ color: PRIMARY_COLOR }}>
            {fieldObj.label} <span style={{ color: "red" }}>*</span>
          </InputLabel>
          <OutlinedInput
            id={fieldObj.id}
            startAdornment={
              <div className="border-r border-gray-300 pr-2 mr-2">
                <InputAdornment position="start">
                  {fieldObj.icon}
                </InputAdornment>
              </div>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDown}
                  edge="end"
                >
                  {showPassword ? (
                    <Visibility style={{ color: PRIMARY_COLOR }} />
                  ) : (
                    <VisibilityOff style={{ color: PRIMARY_COLOR }} />
                  )}
                </IconButton>
              </InputAdornment>
            }
            name={fieldObj.id}
            autoComplete={fieldObj.id}
            onChange={(event) => setFieldValue(fieldObj.id, event.target.value)}
            autoFocus
            value={values?.[fieldObj.id]}
            label={`${fieldObj.label} *`}
            type={showPassword ? "text" : "password"}
            style={{ marginTop: "2px", ...FONT_STYLES }}
            sx={{
              borderRadius: "7px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: PRIMARY_COLOR,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: PRIMARY_COLOR,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: PRIMARY_COLOR,
              },
            }}
          />
          <ErrorSection touched={touched} errors={errors} fieldObj={fieldObj} />
        </FormControl>
      )}
      {fieldObj?.component === "LABEL_CHECK" && (
        <FormControlLabel
          sx={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "start",
            width: "66%",
          }}
          key={fieldObj?.id}
          control={
            <Checkbox
              value={values?.[fieldObj.id]}
              color="primary"
              onChange={(event, value) => setFieldValue(fieldObj.id, value)}
            />
          }
          label={fieldObj?.label}
        />
      )}
      {fieldObj?.component === "SELECT" && (
        <FormControl
          fullWidth
          key={fieldObj?.id}
          error={!!errors?.[fieldObj.id]}
        >
          <InputLabel id={fieldObj?.id}>{fieldObj.label}</InputLabel>
          <Select
            labelId={fieldObj?.id}
            id={fieldObj?.id}
            value={values?.[fieldObj.id]}
            defaultValue={values?.[fieldObj.id]}
            label={fieldObj.label}
            onChange={(event) => setFieldValue(fieldObj.id, event.target.value)}
          >
            {fieldObj?.options.map((opt, i) => (
              <MenuItem key={i} value={opt.value} style={{ ...FONT_STYLES }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {errors?.[fieldObj.id] && (
            <FormHelperText>{errors[fieldObj.id]}</FormHelperText>
          )}
        </FormControl>
      )}
      {fieldObj?.component === "DATE_PICKER" && (
        <LocalizationProvider dateAdapter={AdapterDayjs} key={fieldObj?.id}>
          <DatePicker
            label={fieldObj.label}
            id={fieldObj.id}
            value={dayjs(values?.[fieldObj.id])}
            onChange={(newValue) => setFieldValue(fieldObj.id, newValue)}
          />
        </LocalizationProvider>
      )}

      {fieldObj?.component === "TEXT_AREA" && (
        <TextField
          key={fieldObj?.id}
          label={fieldObj.label}
          multiline
          rows={4}
          fullWidth
          value={values?.[fieldObj.id]}
          onChange={(event) => setFieldValue(fieldObj.id, event.target.value)}
          variant="outlined"
          error={!!errors?.[fieldObj.id]}
          helperText={errors?.[fieldObj.id] || ""}
        />
      )}
    </>
  );
};
export default FormController;
