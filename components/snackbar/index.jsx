import { Snackbar, Alert } from "@mui/material";

const SnackBar = ({ openAlert, setOpenAlert, message }) => {
  const handleAlertClose = () => {
    setOpenAlert(false);
  };
  return (
    <Snackbar
      open={openAlert}
      autoHideDuration={2000}
      onClose={handleAlertClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        position: "fixed",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "20%",
      }}
    >
      <Alert onClose={handleAlertClose} severity="error" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export default SnackBar;
