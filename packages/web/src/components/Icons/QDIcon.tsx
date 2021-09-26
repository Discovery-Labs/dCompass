import React from "react";
import { Box } from "@chakra-ui/react";

function QDIcon() {
  return (
    <Box
      as="svg"
      role="img"
      width="45px"
      height="33px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 33"
      fill="none"
      _hover={{
        fill: "brand.accent",
      }}
    >
      <circle cx="3.41073" cy="29.5893" r="3.41073" fill="#FFCC00" />
      <circle cx="40.8632" cy="29.5893" r="3.41073" fill="#FFCC00" />
      <circle cx="22.1369" cy="3.41073" r="3.41073" fill="#FFCC00" />
      <path
        d="M6.42545 24.5767L17.0298 7.68823"
        stroke="#6F3FF5"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M37.8485 24.5767L27.2441 7.68823"
        stroke="#6F3FF5"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M9.37566 29.6896L34.8983 29.6896"
        stroke="#6F3FF5"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Box>
  );
}

export default QDIcon;
