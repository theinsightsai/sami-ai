"use client";

import withLayout from "@/components/hoc/withLayout";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ExcelIcon } from "@/constants/assets";
import {
  ADMIN_CLIENT_COUNTERS_DATA,
  ADMIN_TEAM_COUNTERS_DATA,
  TEAM_COUNTERS_DATA,
  IMAGES,
} from "@/constants";

// material-ui
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DUMMY_DATA } from "@/constants/dummyData";
import { motion } from "framer-motion";

// project import
import {
  AnalyticEcommerce,
  MainCard,
  MonthlyBarChart,
  ReportAreaChart,
  UniqueVisitorCard,
  SaleReportCard,
  OrdersTable,
  PageHeader,
  UploadCsvModal,
  ForecastTable,
  AnaVisual,
} from "@/components";

import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { PieChart } from "@mui/x-charts/PieChart";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";

// assets
import GiftOutlined from "@ant-design/icons/GiftOutlined";
import MessageOutlined from "@ant-design/icons/MessageOutlined";
import SettingOutlined from "@ant-design/icons/SettingOutlined";

const columnNamesMap = {
  ds: "Date",
  yhat: "Predicted Value",
  yhat_lower: "Lower Bound",
  yhat_upper: "Upper Bound",
};

const HEADER_IDENTIFIER = {
  ANALYZE: "ANALYZE",
  FORECAST: "FORECAST",
};

const BUTTON_CONSTANT = [
  {
    label: "Analyze & Visual",
    identifier: HEADER_IDENTIFIER.ANALYZE,
    icon: <AutoGraphIcon />,
  },
  {
    label: "Forecast",
    identifier: HEADER_IDENTIFIER.FORECAST,
    icon: <TroubleshootIcon />,
  },
];

const Dashboard = () => {
  const role_id = useSelector((state) => state?.auth?.role_id);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const [foreCastingData, setForeCastingData] = useState(null);

  const handleCloseModal = () => {
    setSelectedService({});
    setOpenUploadModal(false);
  };

  const handleOpenModal = (event, obj) => {
    if (obj.identifier === HEADER_IDENTIFIER.ANALYZE) {
      setSelectedService({
        buttonLabel: obj.label,
        identifier: obj.identifier,
      });
    } else if (obj.identifier === HEADER_IDENTIFIER.FORECAST) {
      setSelectedService({
        buttonLabel: obj.label,
        identifier: obj.identifier,
      });
    } else {
      console.log("Handle the array button click");
    }
    setOpenUploadModal(true);
  };

  useEffect(() => {
    let timer;

    if (loading) {
      timer = setTimeout(() => {
        setShowMessage(true);
      }, 7000);
    } else {
      setShowMessage(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <PageHeader
            text="Home"
            buttonText=""
            onButtonClick={() => {}}
            icon={<ExcelIcon height={30} width={30} />}
            buttonArray={BUTTON_CONSTANT}
            onArrayButtonClick={handleOpenModal}
          />
        </Grid>

        {role_id === 1 && (
          <>
            {ADMIN_CLIENT_COUNTERS_DATA.map((counterObj, i, arr) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={`${counterObj.title}-${i}`}
                >
                  <AnalyticEcommerce
                    title={counterObj.title}
                    count={counterObj.counts}
                    description={counterObj.description}
                  />
                </Grid>
              );
            })}

            {ADMIN_TEAM_COUNTERS_DATA.map((counterObj, i, arr) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={`${counterObj.title}-${i}`}
                >
                  <AnalyticEcommerce
                    title={counterObj.title}
                    count={counterObj.counts}
                    description={counterObj.description}
                  />
                </Grid>
              );
            })}
          </>
        )}

        {role_id === 2 &&
          TEAM_COUNTERS_DATA.map((counterObj, i, arr) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={`${counterObj.title}-${i}`}
              >
                <AnalyticEcommerce
                  title={counterObj.title}
                  count={counterObj.counts}
                  description={counterObj.description}
                />
              </Grid>
            );
          })}

        <Grid
          item
          md={8}
          sx={{ display: { sm: "none", md: "block", lg: "none" } }}
        />

        {data === null && foreCastingData === null && !loading && (
          <div
            style={{
              height: "70vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>Upload file to Analysis or Forecast CSV</div>
          </div>
        )}

        {data === null && loading && (
          <div
            style={{
              height: "70vh",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {/* Animated "Analysing..." Text */}
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>Analysing...</div>{" "}
              <img
                src={IMAGES.LOADER_FILE}
                style={{ height: "50px", width: "50px" }}
              />
            </motion.div>

            {/* Smooth fade-in message after 3 seconds */}
            {showMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 3 }}
                style={{ fontSize: "16px" }}
              >
                Please wait, we are still analyzing the file.
              </motion.div>
            )}
          </div>
        )}

        <AnaVisual data={data} loading={loading} />

        <ForecastTable foreCastingData={foreCastingData} />
      </Grid>
      <UploadCsvModal
        selectedService={selectedService}
        setLoading={setLoading}
        open={openUploadModal}
        handleClose={handleCloseModal}
        setData={setData}
        setForeCastingData={setForeCastingData}
      />
    </>
  );
};
export default withLayout(Dashboard);

{
  /* <Grid item xs={12} md={12} lg={6}>
          <MainCard
            content={false}
            sx={{ mt: 1.5 }}
            style={{ padding: "20px" }}
          >
            text
            <Box sx={{ pt: 1, pr: 2 }}>
              <LineChart
                dataset={data?.insights?.[0]?.visualization?.data}
                xAxis={[{ dataKey: "x", scaleType: "band" }]}
                series={[{ dataKey: "y" }]}
                height={300}
                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
          </MainCard>
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <MainCard
            content={false}
            sx={{ mt: 1.5 }}
            style={{ padding: "20px" }}
          >
            text
            <Box sx={{ pt: 1, pr: 2 }}>
              <LineChart
                dataset={data?.insights?.[0]?.visualization?.data}
                xAxis={[{ dataKey: "x", scaleType: "band" }]}
                series={[{ dataKey: "y" }]}
                height={300}
                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
          </MainCard>
        </Grid> */
}

{
  /* <UniqueVisitorCard /> */
}

{
  /* <Grid item xs={12} md={5} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Income Overview</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <Box sx={{ p: 3, pb: 0 }}>
              <Stack spacing={2}>
                <Typography variant="h6" color="text.secondary">
                  This Week Statistics
                </Typography>
                <Typography variant="h3">$7,650</Typography>
              </Stack>
            </Box>
            <MonthlyBarChart />
          </MainCard>
        </Grid> */
}

{
  /* <Grid item xs={12} md={7} lg={8}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Recent Orders</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <OrdersTable />
          </MainCard>
        </Grid> */
}
{
  /* <Grid item xs={12} md={5} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Analytics Report</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <List sx={{ p: 0, "& .MuiListItemButton-root": { py: 2 } }}>
              <ListItemButton divider>
                <ListItemText primary="Company Finance Growth" />
                <Typography variant="h5">+45.14%</Typography>
              </ListItemButton>
              <ListItemButton divider>
                <ListItemText primary="Company Expenses Ratio" />
                <Typography variant="h5">0.58%</Typography>
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Business Risk Cases" />
                <Typography variant="h5">Low</Typography>
              </ListItemButton>
            </List>
            <ReportAreaChart />
          </MainCard>
        </Grid> */
}

{
  /* <Grid item xs={12} md={7} lg={8}>
          <SaleReportCard />
        </Grid> */
}
{
  /* <Grid item xs={12} md={5} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Transaction History</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <List
              component="nav"
              sx={{
                px: 0,
                py: 0,
                "& .MuiListItemButton-root": {
                  py: 1.5,
                  "& .MuiAvatar-root": avatarSX,
                  "& .MuiListItemSecondaryAction-root": {
                    ...actionSX,
                    position: "relative",
                  },
                },
              }}
            >
              <ListItemButton divider>
                <ListItemAvatar>
                  <Avatar
                    sx={{ color: "success.main", bgcolor: "success.lighter" }}
                  >
                    <GiftOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">Order #002434</Typography>
                  }
                  secondary="Today, 2:00 AM"
                />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $1,430
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      78%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
              <ListItemButton divider>
                <ListItemAvatar>
                  <Avatar
                    sx={{ color: "primary.main", bgcolor: "primary.lighter" }}
                  >
                    <MessageOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">Order #984947</Typography>
                  }
                  secondary="5 August, 1:45 PM"
                />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $302
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      8%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    sx={{ color: "error.main", bgcolor: "error.lighter" }}
                  >
                    <SettingOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">Order #988784</Typography>
                  }
                  secondary="7 hours ago"
                />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $682
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      16%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
            </List>
          </MainCard>
          <MainCard sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Stack>
                    <Typography variant="h5" noWrap>
                      Help & Support Chat
                    </Typography>
                    <Typography variant="caption" color="secondary" noWrap>
                      Typical replay within 5 min
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item>
                  <AvatarGroup
                    sx={{ "& .MuiAvatar-root": { width: 32, height: 32 } }}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={"https://picsum.photos/200"}
                    />
                    <Avatar
                      alt="Travis Howard"
                      src={"https://picsum.photos/200"}
                    />
                    <Avatar
                      alt="Cindy Baker"
                      src={"https://picsum.photos/200"}
                    />
                    <Avatar
                      alt="Agnes Walker"
                      src={"https://picsum.photos/200"}
                    />
                  </AvatarGroup>
                </Grid>
              </Grid>
              <Button
                size="small"
                variant="contained"
                sx={{ textTransform: "capitalize" }}
              >
                Need Help?
              </Button>
            </Stack>
          </MainCard>
        </Grid> */
}

// {obj?.visualization?.chart_type === "scatter" && (
//   <ScatterChart
//     width={500}
//     height={300}
//     xAxis={[{ dataKey: "x", scaleType: "band" }]}
//     series={[{ dataKey: "y" }]}
//     series={[
//       ...obj?.visualization?.data?.map((minObj, i, arr) => {
//         return {
//           data: [minObj],
//           label: minObj.label,
//           id: `${i}-${minObj.label}`,
//         };
//       }),
//     ]}
//     xAxis={[{ min: 0 }]}
//     margin={{ left: 50, right: 30, top: 100, bottom: 30 }}
//   />
// )}
