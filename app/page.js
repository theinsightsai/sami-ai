"use client";
import { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import { ToastMessage, AnaVisual } from "@/components";
import { API } from "./api/apiConstant";
import { ERROR_TEXT } from "@/constants";
import { motion } from "framer-motion";
import { ExcelFile } from "@/constants/assets";
import CloseIcon from "@mui/icons-material/Close"; // MUI close icon
import { DUMMY_DATA } from "@/constants/dummyData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

// const aiResponse = {
//   charts_data: [
//     {
//       title: "Market Growth Over Time",
//       type: "line_chart",
//       x_axis: ["2020", "2021", "2022", "2023", "2024", "2025"],
//       y_axis: [50, 65, 80, 100, 130, 160],
//     },
//     {
//       title: "Consumer Spending Trends",
//       type: "bar_chart",
//       x_axis: ["Q1", "Q2", "Q3", "Q4"],
//       y_axis: [200, 220, 250, 270],
//     },
//   ],
//   competitive_landscape: {
//     market_positioning:
//       "Tesla leads in innovation and brand prestige, Volkswagen excels in global reach and diverse offerings, while BYD focuses on affordable options and regional dominance.",
//     top_competitors: [
//       "Tesla: Holds a market share of approximately 20%, known for innovation and a strong brand presence. Weaknesses include high production costs.",
//       "Volkswagen: Market share of around 15%, strengths in global reach and a diverse portfolio. Faces challenges in rapid transformation.",
//       "BYD: Holds a market share of about 10%, strong in the Chinese market with cost-effective models. Limited brand recognition outside Asia.",
//     ],
//   },
//   consumer_insights: {
//     demographics:
//       "The primary consumers of electric vehicles are urban dwellers aged 25-45 with higher disposable incomes. This group values sustainability and technological innovation.",
//     trends: [
//       "Increased adoption of EVs in urban areas due to better charging infrastructure and government policies.",
//       "Growing interest in EVs among younger consumers, driven by environmental consciousness and lifestyle aspirations.",
//       "Rising demand for electric SUVs and trucks, reflecting consumer preference for larger vehicles with increased functionality.",
//     ],
//   },
//   financial_analysis: {
//     profitability:
//       "Major players like Tesla and Volkswagen have seen improving profit margins due to scale economies and technology improvements, with Tesla achieving a gross margin of around 25%.",
//     revenue_trends:
//       "Over the past five years, the electric vehicle market has seen consistent revenue growth, averaging 18% annually. Future forecasts indicate accelerated growth due to rising demand and technological advancements.",
//   },
//   forecasting_analysis: {
//     growth_projections:
//       "The electric vehicle market is expected to grow at a CAGR of 20-25% over the next five years, driven by technological innovations, policy support, and consumer shifts towards sustainable transportation.",
//     potential_challenges:
//       "Challenges include the need for extensive charging infrastructure, raw material supply constraints for batteries, and the transition of traditional automotive companies to EV production.",
//   },
//   key_takeaways: [
//     "The electric vehicle market is on a rapid growth trajectory, with substantial opportunities for innovation and expansion.",
//     "Companies should focus on enhancing battery technology and infrastructure development to capitalize on market trends.",
//     "Collaborations between governments and private sectors will be crucial in overcoming infrastructure and resource challenges to ensure sustainable market growth.",
//   ],
//   market_overview: {
//     industry_size:
//       "As of 2023, the global electric vehicle market was valued at approximately $400 billion. It is projected to reach $1.5 trillion by 2025, growing at a CAGR of over 20%.",
//     key_drivers: [
//       "Advancements in battery technology: Improved battery efficiency and reduced costs are making EVs more accessible and affordable.",
//       "Government incentives: Policies and subsidies are encouraging both consumers and manufacturers to adopt and produce EVs.",
//       "Environmental awareness: Growing concern over carbon emissions is driving demand for cleaner transportation alternatives.",
//     ],
//   },
//   summary:
//     "The electric vehicle (EV) market is poised for significant growth by 2025, driven by advancements in battery technology, government incentives, and increased consumer demand for sustainable transportation solutions. The market is expected to witness a CAGR of over 20%, with key players expanding their production capabilities to meet rising demand. Consumer preferences are shifting towards EVs due to their environmental benefits and long-term cost savings. Despite potential challenges such as infrastructure development and raw material supply, the industry is set to transform the global automotive landscape.",
//   title: "Trends and Projections in the Electric Vehicle Market in 2025",
// };

const TypingEffect = ({ text, onComplete }) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text?.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 10);

      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [index, text, onComplete]);

  return <div style={{ fontSize: "15px" }}>{displayText}</div>;
};

const Input = styled("input")({
  display: "none",
});

export default function Home() {
  const messagesEndRef = useRef(null);
  const analysingEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      text: "Try searching for ‘SAMI AI’ to explore the advanced technologies it provides, including market trend analysis, consumer behavior insights, and competitive landscape evaluation. What would you like to explore today?",
      sender: "bot",
      data: null,
    },
  ]);

  const [prmopt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [postApi, setPostApi] = useState(null);
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const loadApi = async () => {
      const { postApi } = await import("@/app/api/clientApi");
      setPostApi(() => postApi);
    };

    loadApi();
  }, []);

  useEffect(() => {}, [refresh]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAnalysing = () => {
    analysingEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
    if (loading) {
      scrollToAnalysing();
    }
  }, [messages, loading]);

  const handleSend = async () => {
    // if (!file && !fileId) {
    //   return ToastMessage("error", "Please upload a file to proceed with.");
    // }
    if (!prmopt.trim()) {
      return ToastMessage(
        "error",
        "Please enter a prompt to specify what you want to search for."
      );
    }
    let payload = { text: prmopt };
    // if (fileId !== null) {
    //   payload.file_id = fileId;
    // }
    setMessages([...messages, { text: prmopt, sender: "user", data: null }]);
    setLoading(true);
    try {
      const response = await postApi(API.SAMI_AI_QUERY, {
        ...payload,
      });
      const aiResponse = response?.data;
      if (response?.error) {
        ToastMessage("error", response?.message);
      } else if (!response?.error) {
        setMessages([
          ...messages,
          { text: prmopt, sender: "user", data: null },
          {
            sender: "bot",
            data: aiResponse,
            isChartContent: false,
          },
        ]);
      }
    } catch (error) {
      setError("Error uploading file.");
    } finally {
      setFile(null);
      setPrompt("");
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();
      const allowedTypes = ["csv", "xls", "xlsx"];
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes

      if (!allowedTypes.includes(fileType)) {
        return ToastMessage(
          "error",
          "Only CSV, XLS, and XLSX files are allowed."
        );
      } else if (selectedFile.size > maxSize) {
        return ToastMessage("error", "File size must be less than 2MB.");
      } else {
        setIsUploadingFile(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
          const response = await postApi(API.UPLOAD_EXCEL_FILE, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response?.error) {
            return ToastMessage("error", response?.message);
          } else {
            setFileId(response?.data?.data?.id);
            setFile(null);
            setFile(selectedFile);
          }
        } catch (error) {
          setError("Error uploading file.");
        } finally {
          setIsUploadingFile(false);
        }
      }
    }
  };

  const handleCrossFile = () => {
    setFile(null);
  };

  const formatChartData = (chart) =>
    chart.x_axis.map((label, index) => ({
      name: label,
      value: chart.y_axis[index],
    }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#1E1E1E",
        color: "white",
      }}
    >
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#121212" }}>
        <Toolbar>
          <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Sami AI</Typography>
        </Toolbar>
      </AppBar>

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: { sm: "95%", md: "80%", lg: "70%", xl: "50%" },
            background: "black",
            borderRadius: "10px",
            overflowY: "auto",
          }}
        >
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: "#333",
                    color: "white",
                    borderRadius: 2,
                    maxWidth: "75%",
                    textAlign: msg.sender === "user" ? "end" : "start",
                  }}
                >
                  {msg.sender === "bot" ? (
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          padding: "5px 0px",
                        }}
                      >
                        <TypingEffect
                          text={msg?.data?.title}
                          onComplete={() => {}}
                        />
                      </div>
                      <div style={{ fontSize: "14px", marginBottom: "5px" }}>
                        {msg?.text}
                      </div>
                      <div style={{ fontSize: "15px", marginBottom: "5px" }}>
                        <TypingEffect
                          text={msg?.data?.summary}
                          onComplete={() => {}}
                        />
                      </div>

                      {/* Competitive landscape */}
                      {msg?.data?.competitive_landscape && (
                        <>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "18px",
                              padding: "7px 0px",
                            }}
                          >
                            <TypingEffect
                              text={
                                msg?.data?.competitive_landscape
                                  ?.market_positioning
                              }
                              onComplete={() => {}}
                            />
                          </div>
                          {msg?.data?.competitive_landscape?.top_competitors
                            ?.length > 0 && (
                            <ul>
                              {msg?.data?.competitive_landscape?.top_competitors?.map(
                                (point, i) => (
                                  <li key={i}>
                                    <div style={{ fontSize: "14px" }}>
                                      <TypingEffect
                                        text={`${i + 1}. ${point}`}
                                        onComplete={() => {}}
                                      />
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </>
                      )}

                      {/* Consumer Insights */}
                      {msg?.data?.consumer_insights && (
                        <>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "18px",
                              padding: "7px 0px",
                            }}
                          >
                            <TypingEffect
                              text={msg?.data?.consumer_insights?.demographics}
                              onComplete={() => {}}
                            />
                          </div>
                          {msg?.data?.consumer_insights?.trends?.length > 0 && (
                            <ul>
                              {msg?.data?.consumer_insights?.trends?.map(
                                (point, i) => (
                                  <li key={i}>
                                    <div style={{ fontSize: "14px" }}>
                                      <TypingEffect
                                        text={`${i + 1}. ${point}`}
                                        onComplete={() => {}}
                                      />
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </>
                      )}

                      {/* Financial Analysis */}
                      {msg?.data?.financial_analysis && (
                        <>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "18px",
                              padding: "7px 0px",
                            }}
                          >
                            <TypingEffect
                              text={
                                msg?.data?.financial_analysis?.profitability
                              }
                              onComplete={() => {}}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              padding: "5px 0px",
                            }}
                          >
                            <TypingEffect
                              text={
                                msg?.data?.financial_analysis?.revenue_trends
                              }
                              onComplete={() => {}}
                            />
                          </div>
                        </>
                      )}

                      {/* Forecasting Analysis */}
                      {msg?.data?.forecasting_analysis && (
                        <>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "18px",
                              padding: "7px 0px",
                            }}
                          >
                            <TypingEffect
                              text={
                                msg?.data?.forecasting_analysis
                                  ?.growth_projections
                              }
                              onComplete={() => {}}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              padding: "5px 0px",
                            }}
                          >
                            <TypingEffect
                              text={
                                msg?.data?.forecasting_analysis
                                  ?.potential_challenges
                              }
                              onComplete={() => {}}
                            />
                          </div>
                        </>
                      )}

                      {/* Market Overview */}
                      {msg?.data?.market_overview && (
                        <>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "18px",
                              padding: "7px 0px",
                            }}
                          >
                            <TypingEffect
                              text={msg?.data?.market_overview?.industry_size}
                              onComplete={() => {}}
                            />
                          </div>
                          {msg?.data?.market_overview?.key_drivers?.length >
                            0 && (
                            <ul>
                              {msg?.data?.market_overview?.key_drivers?.map(
                                (point, i) => (
                                  <li key={i}>
                                    <div style={{ fontSize: "14px" }}>
                                      <TypingEffect
                                        text={`${i + 1}. ${point}`}
                                        onComplete={() => {}}
                                      />
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </>
                      )}

                      {/*Key Takeaways */}
                      {msg?.data?.key_takeaways && (
                        <>
                          {msg?.data?.key_takeaways?.length > 0 && (
                            <ul>
                              {msg?.data?.key_takeaways?.map((point, i) => (
                                <li key={i}>
                                  <div style={{ fontSize: "14px" }}>
                                    <TypingEffect
                                      text={`${i + 1}. ${point}`}
                                      onComplete={() => {}}
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: "15px" }}>{msg.text}</div>
                  )}
                </Paper>
              </ListItem>
            ))}

            <div ref={messagesEndRef} />

            {(loading || isUploadingFile) && (
              <ListItem
                sx={{
                  justifyContent: "flex-start",
                }}
              >
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: "#333",
                    color: "white",
                    borderRadius: 2,
                    maxWidth: "75%",
                    textAlign: "start",
                  }}
                >
                  <>
                    <motion.div
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        fontSize: "15px",
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      <div>
                        {isUploadingFile ? "Uploading..." : "Analysing..."}
                      </div>{" "}
                    </motion.div>
                  </>
                </Paper>
                <div ref={analysingEndRef} />
              </ListItem>
            )}
          </List>
        </Box>
      </Box>

      {/* Input Field & Upload Button */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            padding: "10px 10px",
            width: { sm: "95%", md: "80%", lg: "70%", xl: "50%" },
            display: "flex",
            alignItems: "center",
            bgcolor: "#121212",
            borderRadius: "10px",
          }}
        >
          {/* File Upload Button */}
          <label htmlFor="file-upload">
            <Input
              accept=".csv,.xls,.xlsx"
              id="file-upload"
              type="file"
              onChange={(event) => {
                handleFileUpload(event);
                event.target.value = ""; // Reset input field after upload attempt
              }}
            />
            <IconButton
              color="primary"
              component="span"
              sx={{ color: "white", marginRight: "5px" }}
            >
              <AddIcon />
            </IconButton>
          </label>

          {/* Text Input */}

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter keywords or industry..."
            value={prmopt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ input: { color: "white" }, bgcolor: "#333", borderRadius: 1 }}
            InputProps={{
              startAdornment: file && (
                <div style={{ position: "relative" }}>
                  <ExcelFile />
                  <div
                    style={{
                      background: "lightgray",
                      position: "absolute",
                      right: "10px",
                      top: "-10px",
                      padding: " 0px 3px",
                      borderRadius: "100%",
                      cursor: "pointer",
                    }}
                  >
                    <CloseIcon fontSize="sm" onClick={handleCrossFile} />
                  </div>
                </div>
              ),
            }}
          />

          {/* Send Button */}
          <IconButton
            color="primary"
            onClick={handleSend}
            sx={{ ml: 1, color: "white", marginLeft: "5px" }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

// const file = event.target.files?.[0];
// if (file) {
//   setMessages([
//     ...messages,
//     { text: `Uploaded: ${file.name}`, sender: "user" },
//   ]);
// }

// try {
// setLoading(true);
// if (!postApi) {
//   ToastMessage("error", ERROR_TEXT.API_LOAD_ERROR);
//   return;
// }
// const formData = new FormData();
// formData.append("file", csvFile);
// formData.append("prmopt", prmopt);
//   const response = await postApi(API.UPLOAD_FILE, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   if (response?.error) {
//     ToastMessage("error", response?.message);
//   } else if (!response?.error) {
//     setData(response?.data);
//   }
// } catch (error) {
//   ToastMessage("error", ERROR_TEXT.SOMETHING_WENT_WRONG);
// } finally {
//   setLoading(false);
// }

// setMessages([...messages, { text: prmopt, sender: "user" }]);
// setPrompt("");

{
  /* {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                sx={{
                  p: 3,
                  bgcolor: "#333",
                  color: "white",
                  borderRadius: 2,
                  maxWidth: "75%",
                  textAlign: msg.sender === "user" ? "end" : "start",
                }}
              >
                {msg?.isChartContent ? (
                  <>
                    <ListItemText primary={msg.text} />
                    <AnaVisual data={msg.data} />
                  </>
                ) : (
                  <ListItemText primary={msg.text} />
                )}
              </Paper>
            </ListItem>
          ))} */
}
