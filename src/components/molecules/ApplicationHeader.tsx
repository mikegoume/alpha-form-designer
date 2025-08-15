import { useRef, useState } from "react";
import {
  Avatar,
  Badge,
  badgeClasses,
  IconButton,
  InputAdornment,
  styled,
  TextField,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Bell, LogOut, Search, Settings } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

function ApplicationHeader() {
  const { username } = useAuth().user;
  const searchText = useRef("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnChangeText = (text: string) => {
    searchText.current = text;
  };

  return (
    <div className="flex flex-row items-center justify-between gap-6 px-8 py-2 border-b">
      <TextField
        fullWidth
        id="input-with-icon-textfield"
        onChange={(e) => handleOnChangeText(e.target.value)}
        placeholder="Search Template"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search className="w-5 h-5" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ maxWidth: "60%" }}
      />
      <div className="flex flex-row gap-6">
        <IconButton
          size="medium"
          sx={{
            sizeMedium: {
              height: 36,
            },
          }}
        >
          <Bell />
          <CartBadge badgeContent={12} color="primary" overlap="circular" />
        </IconButton>
        <IconButton
          onClick={handleClick}
          size="medium"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{
            width: 36,
            height: 36,
            maxHeight: 36,
          }}
        >
          <Avatar
            alt={username}
            src="/static/images/avatar/1.jpg"
            sx={{ width: 36, height: 36 }}
          />
        </IconButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <LogOut fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default ApplicationHeader;
