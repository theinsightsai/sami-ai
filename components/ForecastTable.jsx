"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Pagination,
  Stack,
} from "@mui/material";

const columnNamesMap = {
  ds: "Date",
  yhat: "Predicted Value",
  yhat_lower: "Lower Bound",
  yhat_upper: "Upper Bound",
};

export default function ForecastTable({ foreCastingData }) {
  console.log("foreCastingData=>", foreCastingData);

  const rowsPerPage = 10; // Set number of rows per page
  const [page, setPage] = useState(1);

  // Calculate pagination
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData =
    foreCastingData?.forecast?.slice(startIndex, endIndex) || [];

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Function to format date and numbers
  const formatValue = (key, value) => {
    if (key === "ds") {
      return new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short", // "Oct" instead of "October"
        year: "numeric",
      });
    }
    if (typeof value === "number") {
      return value.toFixed(2); // Fix numeric values to 2 decimal places
    }
    return value;
  };

  return (
    <Grid item xs={12} md={12} lg={12}>
      {foreCastingData?.plot && (
        <>
          <div className="text-[25px] capitalize font-medium">FORECAST</div>
          <div className="flex mt-6" style={{ marginBottom: "25px" }}>
            <img
              src={`data:image/png;base64,${foreCastingData.plot}`}
              alt="Forecast Plot"
              className="w-full max-w-3xl rounded-lg shadow-md"
            />
          </div>
        </>
      )}
      {foreCastingData?.forecast?.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="forecast table">
              <TableHead>
                <TableRow>
                  {/* Serial Number Column */}
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    S.No
                  </TableCell>

                  {/* Dynamically generate table headers */}
                  {Object.keys(foreCastingData.forecast[0]).map((key) => (
                    <TableCell
                      key={key}
                      align="left"
                      sx={{ fontWeight: "bold" }}
                    >
                      {columnNamesMap[key] || key.toUpperCase()}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Generate table rows dynamically */}
                {paginatedData.map((item, index) => (
                  <TableRow key={index}>
                    {/* Serial Number Calculation */}
                    <TableCell align="left">
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>

                    {Object.entries(item).map(([key, value], idx) => (
                      <TableCell key={idx} align="left">
                        {formatValue(key, value)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Pagination
              count={Math.ceil(foreCastingData.forecast.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </>
      )}
    </Grid>
  );
}
