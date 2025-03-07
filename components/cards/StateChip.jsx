import { Grid, Chip } from "@mui/material";

const iconSX = {
  fontSize: "0.75rem",
  color: "inherit",
  marginLeft: 0,
  marginRight: 0,
};

import RiseOutlined from "@ant-design/icons/RiseOutlined";
import FallOutlined from "@ant-design/icons/FallOutlined";

const StateChip = ({ text, isLoses, percentage }) => {
  return (
    <Grid item>
      <Chip
        variant="combined"
        icon={
          isLoses ? (
            <FallOutlined style={iconSX} />
          ) : (
            <RiseOutlined style={iconSX} />
          )
        }
        label={`${percentage}%`}
        sx={{
          ml: 1.25,
          mr: 1.25,
          pl: 1,
          backgroundColor: isLoses ? "#FFE5E5" : "#E8F5E9",
          color: isLoses ? "#D32F2F" : "#388E3C",
        }}
        size="small"
      />
      {text}
    </Grid>
  );
};

export default StateChip;
