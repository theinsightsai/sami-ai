"use client";
import React, { useState, useEffect } from "react";
import { ToastMessage } from "@/components";
import { ERROR_TEXT } from "@/constants";
import { API } from "../api/apiConstant";
import ForecastingModal from "@/components/ForecastingModal";
import withLayout from "@/components/hoc/withLayout";
import { Button, Box, TextField } from "@mui/material";
import { AnaVisual } from "@/components";
import { ForecastTable } from "@/components";

const NewDashboard = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [postApi, setPostApi] = useState(null);
  const [data, setData] = useState(null);
  const [openForecasting, setOpenForecasting] = useState(false);
  const [isVisibleInput, setIsVisibleInput] = useState(false);
  const [inputText, setInputText] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [forecastData, setForcastData] = useState(null);

  useEffect(() => {
    const loadApi = async () => {
      const { postApi } = await import("@/app/api/clientApi");
      setPostApi(() => postApi);
    };
    loadApi();
  }, []);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();
      const allowedTypes = ["csv", "xls", "xlsx"];

      if (!allowedTypes.includes(fileType)) {
        setError("Only CSV, XLS, and XLSX files are allowed.");
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a valid file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await postApi(API.UPLOAD_EXCEL_FILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.error) {
        ToastMessage("error", response?.message);
      } else if (!response?.error) {
        setData(response?.data?.data);
      }
    } catch (error) {
      setError("Error uploading file.");
    }
  };

  const onOptionsClick = (event, identifier) => {
    if (identifier === "FORECASTING") {
      setOpenForecasting(true);
    } else if (identifier === "ANALYSIS") {
      setIsVisibleInput(true);
    } else if (identifier === "SENTIMENT") {
      setIsVisibleInput(true);
    } else if (identifier === "WEB_SCRAPPING") {
      setIsVisibleInput(true);
    } else {
    }
  };

  const onAnalysisClick = async () => {
    console.log(data?.id, inputText);
    try {
      const response = await postApi(API.ANALYSIS, {
        file_id: data?.id,
        prompt: inputText,
      });

      if (response?.error) {
        ToastMessage("error", response?.message);
      } else if (!response?.error) {
        setAnalysisData(response?.data);
      }
    } catch (error) {
      setError("Error uploading file.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Upload Your File
          </h2>

          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept=".csv, .xls, .xlsx"
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-md cursor-pointer w-full"
            />

            {file && (
              <div className="text-center">
                <p className="text-gray-600 text-sm">Selected File:</p>
                <p className="text-blue-600 font-medium">{file.name}</p>
              </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Upload File
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            onClick={(event) => onOptionsClick(event, "FORECASTING")}
          >
            Forecasting
          </button>
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
            onClick={(event) => onOptionsClick(event, "ANALYSIS")}
          >
            Analysis & Visual
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
            onClick={(event) => onOptionsClick(event, "SENTIMENT")}
          >
            Sentiment Analysis
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            onClick={(event) => onOptionsClick(event, "WEB_SCRAPPING")}
          >
            Web Scraping
          </button>
        </div>
        {isVisibleInput && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: 2,
                p: 3,
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                background: "#fff",
                paddingTop: "20px",
                width: "50%",
              }}
            >
              {/* Input Field */}
              <TextField
                label="Enter Text for Analysis"
                variant="outlined"
                fullWidth
                onChange={(event) => setInputText(event.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#007bff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#007bff",
                    },
                  },
                }}
              />

              {/* Analysis Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={onAnalysisClick}
                sx={{
                  width: "100%",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: "8px",
                  p: 1.5,
                  backgroundColor: "#007bff",
                  "&:hover": {
                    backgroundColor: "#0056b3",
                  },
                }}
              >
                Analysis & Visual 📊
              </Button>
            </Box>
          </>
        )}
      </div>
      <ForecastingModal
        open={openForecasting}
        handleClose={() => setOpenForecasting(false)}
        data={data}
        setForcastData={setForcastData}
      />

      <AnaVisual data={analysisData} loading={loading} />
      <ForecastTable foreCastingData={forecastData} />
    </>
  );
};

export default withLayout(NewDashboard);
