"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { API } from "@/app/api/apiConstant";

const ForecastingModal = ({ open, handleClose, data, setForcastData }) => {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedDateColumn, setSelectedDateColumn] = useState("");
  const [forecastPeriod, setForecastPeriod] = useState("");
  const [postApi, setPostApi] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadApi = async () => {
      const { postApi } = await import("@/app/api/clientApi");
      setPostApi(() => postApi);
    };
    loadApi();
  }, []);

  const handleSubmit = async () => {
    if (!selectedColumn || !selectedDateColumn || !forecastPeriod) {
      alert("Please fill all fields before submitting.");
      return;
    }

    setForcastData(null);
    try {
      setLoading(true);
      if (!postApi) {
        ToastMessage("error", ERROR_TEXT.API_LOAD_ERROR);
        return;
      }

      handleClose();

      const response = await postApi(API.GET_FORCASTING, {
        file_id: data?.id,
        date_column: selectedDateColumn,
        value_column: selectedColumn,
        periods: forecastPeriod,
      });

      if (response?.error) {
        ToastMessage("error", response?.message);
      } else if (!response?.error) {
        setForcastData(response?.data);
        handleClose();
      }
    } catch (error) {
      ToastMessage("error", ERROR_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="forecast-modal">
      <Box sx={modalStyle}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          Analyzing Your File 📊
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
          We have detected the following columns. Please select the column for
          forecasting.
        </Typography>

        {/* Select Column Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Column for Forecasting</InputLabel>
          <Select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            {data?.columns?.otherColumns?.map((col, index) => (
              <MenuItem key={index} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select Date Column Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Date Column</InputLabel>
          <Select
            value={selectedDateColumn}
            onChange={(e) => setSelectedDateColumn(e.target.value)}
          >
            {data?.columns?.dateColumns?.map((col, index) => (
              <MenuItem key={index} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Number of Periods (Months) */}
        <TextField
          fullWidth
          type="number"
          label="Number of Months for Forecasting"
          value={forecastPeriod}
          onChange={(e) => setForecastPeriod(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Apply Forecasting
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ForecastingModal;

// Modal Styling
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};
