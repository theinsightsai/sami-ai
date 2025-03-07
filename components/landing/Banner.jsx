"use client";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { LANDING_PAGE_BG, ROUTE, IMAGES } from "@/constants";
import { ZikZackSvg } from "@/constants/assets";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: LANDING_PAGE_BG,
        height: "100vh",
        overflowX: "scroll",
      }}
    >
      <Box
        className="flex-grow bg-cover bg-center"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: { xs: "40px 0", md: "10px 0" },
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{ width: { xs: "90%", sm: "80%" }, paddingTop: "10px" }}
        >
          {/* LEFT CONTENT SECTION */}
          <Grid
            item
            xs={12}
            lg={6}
            className="flex flex-col items-center text-center lg:items-start lg:text-start"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: { xs: "auto", md: "95vh" },
            }}
          >
            <Typography
              variant="h3"
              fontWeight={500}
              sx={{
                lineHeight: "1.2",
                textAlign: { xs: "center", lg: "left" },
              }}
            >
              Best AI tool <br />
              to <span className="text-primary_color">forecast</span> your data
            </Typography>

            <Typography
              variant="body1"
              sx={{
                marginTop: "20px",
                width: { xs: "90%", md: "75%" },
                fontFamily: "Outfit, sans-serif",
                color: "#787878",
                fontWeight: 500,
                lineHeight: "18.98px",
                textAlign: { xs: "center", lg: "left" },
              }}
            >
              Leave traditional methods behind! Upload your Excel sheet, and let
              our AI-powered tool forecast your data effortlessly.
            </Typography>

            <Button
              onClick={() => router.push(ROUTE.AUTH)}
              sx={{
                backgroundColor: "#8635FD",
                fontSize: "18px",
                lineHeight: "23.72px",
                fontWeight: 500,
                color: "white",
                borderRadius: "30px",
                padding: "17px 20px",
                marginTop: "30px",
                fontFamily: "Outfit, sans-serif",
                border: "2px solid transparent",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#8635FD",
                  border: "2px solid #8635FD",
                },
                transition: "all 0.3s ease-in-out",
                textTransform: "capitalize",
              }}
            >
              Start your 7-day free trial
            </Button>

            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "14.23px",
                color: "#787878",
                marginTop: "20px",
              }}
            >
              * No credit card required
            </Typography>
          </Grid>

          {/* RIGHT IMAGE SECTION */}
          <Grid
            item
            xs={12}
            lg={6}
            className="hidden lg:flex justify-center items-center"
          >
            <img
              src={IMAGES.BANNER}
              alt="AI Banner"
              style={{
                maxWidth: "100%",
                height: "auto", // Prevents stretching
                objectFit: "contain", // Keeps aspect ratio
              }}
            />
          </Grid>
        </Grid>
      </Box>
      {/* HOW IT WORKS SECTION */}
      <Box
        sx={{ display: "flex", justifyContent: "center", position: "relative" }}
      >
        <div style={{ position: "absolute" }}>
          <ZikZackSvg />
        </div>

        <Grid
          container
          spacing={2}
          sx={{
            width: { xs: "90%", sm: "80%" },
            paddingTop: "30px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            fontWeight={500}
            sx={{ lineHeight: "61.67px", width: "100%" }}
          >
            How our tool works
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "16px",
              fontWeight: "500",
              lineHeight: "18.98px",
              color: "#787878",
              width: "100%",
            }}
          >
            Hit the play button to watch the demo video.
          </Typography>
        </Grid>
      </Box>
    </div>
  );
};

export default LandingPage;
