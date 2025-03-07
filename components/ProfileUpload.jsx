import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Avatar } from "@mui/material";

const ProfileUpload = ({ handleFileChange, profileImage }) => {
  return (
    <label
      htmlFor="contained-button-file"
      className="relative inline-block p-2 rounded-full cursor-pointer"
      style={{ marginBottom: "40px" }}
    >
      <input
        accept="image/jpeg, image/png, image/webp"
        id="contained-button-file"
        multiple
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <Avatar
        src={profileImage}
        style={{
          width: "120px",
          height: "120px",
        }}
      />

      {/* Camera Icon (Click to Upload) */}
      <div className="absolute bottom-1 right-0 bg-white p-1 rounded-full shadow-lg">
        <AddAPhotoIcon className="text-gray-600" />
      </div>
    </label>
  );
};
export default ProfileUpload;
