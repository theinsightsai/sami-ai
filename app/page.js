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

const TypingEffect = ({ text, onComplete }) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 50);

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
      text: "Unlock Insights with Innovation Scout",
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

  // async
  const handleSend = async () => {
    if (!file && !fileId) {
      return ToastMessage("error", "Please upload a file to proceed with.");
    }
    if (!prmopt.trim()) {
      return ToastMessage(
        "error",
        "Please enter a prompt to specify what you want to search for."
      );
    }

    let payload = { prmopt: prmopt };
    if (fileId !== null) {
      payload.file_id = fileId;
    }
    setMessages([...messages, { text: prmopt, sender: "user", data: null }]);
    setLoading(true);

    try {
      const response = await postApi(API.ANALYSIS, {
        ...payload,
      });

      if (response?.error) {
        ToastMessage("error", response?.message);
      } else if (!response?.error) {
        setMessages([
          ...messages,
          { text: prmopt, sender: "user", data: null },
          {
            text: response?.data?.summary,
            sender: "bot",
            data: response?.data,
            isChartContent: true,
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
                  {msg?.isChartContent ? (
                    <TypingEffect
                      text={msg.text}
                      onComplete={() => {
                        msg.showVisualization = true;
                        setRefresh(!refresh);
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: "15px" }}>{msg.text}</div>
                  )}
                  {msg?.isChartContent && msg.showVisualization && (
                    <AnaVisual data={msg.data} />
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
