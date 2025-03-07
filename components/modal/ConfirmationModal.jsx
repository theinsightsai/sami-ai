"use client";
import React from "react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";

const ConfirmationModal = ({
  open,
  handleClose,
  handleConfirmClick,
  buttontext,
  user,
  alertText,
}) => {
  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <div className="p-5">
          <div className="p-2 px-5 text-lg text-black p-4 bg-[#e4f5ff] rounded-md">
            Alert
            {alertText && (
              <div className="text-sm mt-1 italic">{alertText}</div>
            )}
          </div>
          <DialogContent>
            Are you sure you want to{" "}
            <span style={{ textTransform: "lowercase" }}>{buttontext}</span>{" "}
            <span className="font-medium text-black">
              {user?.user} ({user?.userType})
            </span>
            ?
          </DialogContent>
          <DialogActions className="mt-6">
            <button
              onClick={handleClose}
              className="gap-1 flex justify-center items-center border-2 border-[#005B96] rounded-[5px] text-[#005B96]  text-md font-semibold no-underline p-2 px-5 hover:bg-white hover:text-[#005B96] hover:border-[#005B96] transition duration-300 ease-in-out "
            >
              Cancel
            </button>

            <button
              onClick={(event) => handleConfirmClick(event, buttontext)}
              className={`gap-1 flex justify-center items-center rounded-[5px] text-md font-semibold no-underline p-2 px-5 transition duration-300 ease-in-out group
                bg-[#005B96] border-2 border-[#005B96] text-white hover:bg-white hover:text-[#005B96] capitalize`}
            >
              {buttontext}
            </button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};

export default ConfirmationModal;
