import { Fragment } from "react";
import { MainCard } from ".";
// import MainCard from "./cards/AnalyticEcommerce";
import { Grid, Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

const AnaVisual = ({ data, loading = false }) => {
  return (
    <>
      {data !== null &&
        !loading &&
        data?.insights?.map((obj, i, arr) => {
          return (
            <Fragment key={i}>
              {["line", "bar", "pie"].includes(
                obj?.visualization?.chart_type
              ) && (
                <Grid item xs={12} md={12} lg={6} key={i}>
                  <MainCard
                    content={false}
                    sx={{ mt: 1.5 }}
                    style={{ padding: "20px" }}
                  >
                    <div style={{ fontSize: "20px" }}>
                      {obj?.visualization?.title}
                    </div>
                    <Box
                      sx={{ pt: 1, pr: 2 }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      {obj?.visualization?.chart_type === "line" && (
                        <LineChart
                          dataset={obj?.visualization?.data}
                          xAxis={[
                            {
                              dataKey: "x",
                              scaleType: "band",
                              label: obj?.visualization?.x_label || "X-Axis",
                              stroke: "#1F2937", // Dark gray stroke
                              labelStyle: {
                                fill: "#1F2937", // Text color
                                fontSize: "16px",
                                fontWeight: "600",
                                fontStyle: "italic",
                                paddingTop: "10px",
                              },
                              tickLabelStyle: {
                                fill: "#374151",
                                fontSize: "14px",
                              },
                            },
                          ]}
                          series={[
                            {
                              dataKey: "y",
                              label: obj?.visualization?.y_label || "Y-Axis",
                              color: "#10B981", // Green line
                              curveType: "monotone", // Smooth curved line
                              strokeWidth: 3, // Thicker line
                              markerShape: "circle", // Circle markers on data points
                              markerSize: 6, // Bigger markers
                              showMark: true, // Ensures markers appear
                              highlightScope: {
                                faded: "global",
                                highlighted: "item",
                              }, // Highlighting effect on hover
                            },
                          ]}
                          height={350}
                          margin={{
                            left: 40,
                            right: 40,
                            top: 60,
                            bottom: 60,
                          }}
                          grid={{
                            vertical: true,
                            horizontal: true,
                            strokeDasharray: "4 4",
                            stroke: "#E5E7EB",
                          }}
                          tooltip={{
                            enabled: true,
                            trigger: "axis",
                            background: "#fff",
                            borderColor: "#E5E7EB",
                            borderWidth: 1,
                            borderRadius: 6,
                            textStyle: { color: "#1F2937", fontSize: "14px" },
                          }}
                          legend={{
                            position: {
                              vertical: "top",
                              horizontal: "center",
                            },
                            itemStyle: {
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#374151",
                            },
                          }}
                        />
                      )}
                      {obj?.visualization?.chart_type === "bar" && (
                        <BarChart
                          dataset={obj?.visualization?.data}
                          xAxis={[
                            {
                              dataKey: "x",
                              scaleType: "band",
                              label: obj?.visualization?.x_label,
                              stroke: "#374151", // Dark gray
                              labelStyle: {
                                fill: "#1F2937",
                                fontSize: "16px",
                                fontWeight: "600",
                                paddingTop: "10px",
                                fontStyle: "italic",
                              },
                              tickLabelStyle: {
                                fill: "#4B5563",
                                fontSize: "14px",
                                fontWeight: "500",
                              },
                            },
                          ]}
                          series={[
                            {
                              dataKey: "y",
                              label: obj?.visualization?.y_label,
                              color: "#6366F1", // Soft blue
                              highlightScope: {
                                faded: "global",
                                highlighted: "item",
                              },
                              barWidth: 30, // Custom bar width
                              showMark: true, // Show markers at data points
                              gradient: true, // Adds gradient effect
                              opacity: 0.9, // Slight transparency
                            },
                          ]}
                          height={350}
                          margin={{
                            left: 100,
                            right: 50,
                            top: 50,
                            bottom: 60,
                          }}
                          grid={{
                            vertical: true,
                            horizontal: true,
                            strokeDasharray: "4 4",
                            stroke: "#E5E7EB",
                          }}
                          tooltip={{
                            enabled: true,
                            trigger: "axis",
                            background: "#fff",
                            borderColor: "#E5E7EB",
                            borderWidth: 1,
                            borderRadius: 6,
                            textStyle: { color: "#1F2937", fontSize: "14px" },
                          }}
                          legend={{
                            position: {
                              vertical: "top",
                              horizontal: "center",
                            },
                            itemStyle: {
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#374151",
                            },
                          }}
                        />
                      )}

                      {obj?.visualization?.chart_type === "pie" && (
                        <PieChart
                          series={[
                            {
                              data: obj?.visualization?.data?.map((item) => ({
                                id: item.x, // Using `x` as unique identifier
                                value: item.y, // `y` is the numeric value
                                label: item.x, // Display `x` as label
                              })),
                              innerRadius: 30, // Creates a donut-style effect
                              outerRadius: 100,
                              paddingAngle: 3, // Adds spacing between slices
                              cornerRadius: 6, // Smooth corners
                              cx: "50%", // Centers the chart
                              cy: "50%",
                              highlightScope: {
                                faded: "global",
                                highlighted: "item",
                              },
                            },
                          ]}
                          width={400}
                          height={350}
                          margin={{
                            left: 50,
                            right: 50,
                            top: 50,
                            bottom: 50,
                          }}
                          legend={{
                            position: {
                              vertical: "bottom",
                              horizontal: "center",
                            },
                            itemStyle: {
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#374151",
                            },
                          }}
                          tooltip={{
                            enabled: true,
                            background: "#fff",
                            borderColor: "#E5E7EB",
                            borderWidth: 1,
                            borderRadius: 6,
                            textStyle: { color: "#1F2937", fontSize: "14px" },
                          }}
                        />
                      )}
                    </Box>
                    <div className="mt-2">
                      Details<div className="mt-2">{obj.summary}</div>
                    </div>
                  </MainCard>
                </Grid>
              )}
            </Fragment>
          );
        })}
    </>
  );
};
export default AnaVisual;
