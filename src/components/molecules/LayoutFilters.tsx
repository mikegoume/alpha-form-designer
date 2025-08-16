"use client";

import type React from "react";
import { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Grid, List, Search } from "lucide-react";

export default function FilterComponent() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const titleTags = [
    "All",
    "Technology",
    "Design",
    "Business",
    "Marketing",
    "Development",
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
  };

  const handleTagChange = (event: any) => {
    const value = event.target.value;
    setSelectedTag(value);
  };

  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: "grid" | "list" | null,
  ) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <div className="flex flex-row gap-4 w-1/3 items-center justify-end ml-auto">
      {/* Search Input */}
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: <Search className="mr-2" />,
        }}
      />

      {/* Title Tags Dropdown */}
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Category</InputLabel>
        <Select value={selectedTag} label="Category" onChange={handleTagChange}>
          {titleTags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Grid/List Toggle */}
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewChange}
        aria-label="view mode"
      >
        <ToggleButton value="grid" aria-label="grid view" color="primary">
          <Grid />
        </ToggleButton>
        <ToggleButton value="list" aria-label="list view" color="primary">
          <List />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
