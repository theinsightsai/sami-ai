"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, Box } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { ExcelIcon } from "@/constants/assets";
import SnackBar from "../snackbar";
import { ERROR_TEXT } from "@/constants";
import ToastMessage from "@/components/ToastMessage";
import { API } from "@/app/api/apiConstant";
import { showLoader, hideLoader } from "@/store/loaderSlice";
import { useDispatch } from "react-redux";

const UploadCsvModal = ({
  open,
  handleClose,
  setData,
  setLoading,
  selectedService,
  setForeCastingData,
}) => {
  const dispatch = useDispatch();
  const [csvFile, setCsvFile] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [postApi, setPostApi] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (
      file &&
      (file.type === "text/csv" ||
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      setCsvFile(file);
    } else {
      setOpenAlert(true);
    }
  };

  useEffect(() => {
    const loadApi = async () => {
      const { postApi } = await import("@/app/api/clientApi");
      setPostApi(() => postApi);
      // setLoading(false);
    };

    loadApi();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".csv",
  });

  const handleFileUpload = async () => {
    if (selectedService?.identifier === "ANALYZE") {
      setData(null);
      try {
        setLoading(true);
        if (!postApi) {
          ToastMessage("error", ERROR_TEXT.API_LOAD_ERROR);
          return;
        }
        const formData = new FormData();
        formData.append("file", csvFile);
        handleClose();

        const response = await postApi(API.UPLOAD_FILE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response?.error) {
          ToastMessage("error", response?.message);
        } else if (!response?.error) {
          setData(response?.data);
        }
      } catch (error) {
        ToastMessage("error", ERROR_TEXT.SOMETHING_WENT_WRONG);
      } finally {
        setLoading(false);
        // dispatch(hideLoader());
      }
    } else {
      setData(null);
      try {
        // dispatch(showLoader());
        setLoading(true);
        if (!postApi) {
          ToastMessage("error", ERROR_TEXT.API_LOAD_ERROR);
          return;
        }
        const formData = new FormData();
        formData.append("file", csvFile);
        formData.append("column", "sales");
        formData.append("periods", 3);
        handleClose();

        const response = await postApi(API.FORCASTING, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response?.error) {
          ToastMessage("error", response?.message);
        } else if (!response?.error) {
          setForeCastingData(response?.data);
        }
      } catch (error) {
        ToastMessage("error", ERROR_TEXT.SOMETHING_WENT_WRONG);
      } finally {
        setLoading(false);
        // dispatch(hideLoader());
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <div style={{ padding: "20px" }}>
          <div style={{ padding: "10px 20px", fontSize: "20px" }}>
            Upload CSV File
          </div>
          <DialogContent>
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed black",
                padding: "50px",
                textAlign: "center",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <input {...getInputProps()} />
              <div className="w-full flex justify-center">
                <ExcelIcon />
              </div>
              <div className="mt-2">
                Drag & Drop your CSV file here, or click to select a file
              </div>
              {csvFile && (
                <div className="mt-2 font-outfit italic">{csvFile.name}</div>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <button
              onClick={handleClose}
              className="gap-1 flex justify-center items-center border-2 border-[#005B96] rounded-[5px] text-[#005B96]  text-md font-semibold no-underline p-2 px-5 hover:bg-white hover:text-[#005B96] hover:border-[#005B96] transition duration-300 ease-in-out "
            >
              Cancel
            </button>

            <button
              onClick={handleFileUpload}
              className={`gap-1 flex justify-center items-center rounded-[5px] text-md font-semibold no-underline p-2 px-5 transition duration-300 ease-in-out group ${
                csvFile === null
                  ? "bg-gray-300 border-2 border-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#005B96] border-2 border-[#005B96] text-white hover:bg-white hover:text-[#005B96]"
              }`}
              disabled={csvFile === null}
            >
              {selectedService.buttonLabel}
            </button>
          </DialogActions>
        </div>
      </Dialog>
      <SnackBar
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        message="Please upload a valid CSV file."
      />
    </>
  );
};

export default UploadCsvModal;
