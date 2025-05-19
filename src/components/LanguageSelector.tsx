import React from "react";
import { Select, MenuItem, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleChange = (event: any) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleChange}
      variant="standard"
      sx={{
        color: "#42a5f5",
        fontSize: isMobile ? 14 : 16,
        minWidth: 80,
        "&::before": { borderBottom: "none" },
        "&::after": { borderBottom: "none" },
      }}
    >
      <MenuItem value="en">EN</MenuItem>
      <MenuItem value="ua">UA</MenuItem>
    </Select>
  );
};

export default LanguageSelector;