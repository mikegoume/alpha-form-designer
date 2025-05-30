import {
  Avatar,
  Badge,
  badgeClasses,
  IconButton,
  InputAdornment,
  styled,
  TextField,
} from "@mui/material";
import { Bell, Search } from "lucide-react";
import { useRef } from "react";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

function ApplicationHeader() {
  const searchText = useRef("");

  const handleOnChangeText = (text: string) => {
    searchText.current = text;
  };

  return (
    <div className="flex flex-row items-center justify-between gap-6 p-8">
      <TextField
        fullWidth
        id="input-with-icon-textfield"
        onChange={(e) => handleOnChangeText(e.target.value)}
        placeholder="Search Template"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
        }}
        sx={{ maxWidth: "60%" }}
      />
      <div className="flex flex-row gap-6">
        <IconButton>
          <Bell fontSize="small" />
          <CartBadge badgeContent={2} color="primary" overlap="circular" />
        </IconButton>
        <IconButton>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </IconButton>
      </div>
    </div>
  );
}

export default ApplicationHeader;
