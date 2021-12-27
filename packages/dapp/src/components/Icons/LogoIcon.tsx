import React from "react";
import { Box, Flex, Link, useColorMode } from "@chakra-ui/react";

function LogoIcon({ size = "25px" }: { size?: string }) {
  const { colorMode } = useColorMode();
  return (
    <Box alignContent="center">
      {colorMode === "dark" ? (
        <svg
          width={size}
          height={size}
          viewBox="0 0 824 845"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M113 19H412C629.048 19 805 194.952 805 412V433C805 650.048 629.048 826 412 826H113C61.0852 826 19 783.915 19 732V113C19 61.0852 61.0852 19 113 19Z"
            stroke="white"
            strokeWidth="38"
          />
          <path
            d="M356.27 695.303C354.658 693.407 353.854 691.101 353.829 688.817C342.08 600.446 336.217 530.841 335.074 464.527C268.219 463.472 200.722 457.824 116.233 448.845C113.004 449.029 109.761 447.782 107.533 445.172C103.701 440.68 104.326 433.855 108.93 429.926C111.534 427.704 114.854 426.885 117.94 427.405C174.057 419.89 222.143 414.819 265.628 411.763C275.143 408.575 282 399.588 282 389C282 385.02 281.031 381.267 279.317 377.962C266.955 364.378 254.094 349.839 240.27 333.976C238.653 332.638 237.66 330.613 237.753 328.388C237.913 324.56 241.223 321.59 245.147 321.753C247.367 321.846 249.307 322.921 250.545 324.531C268.966 337.542 285.541 349.656 300.691 361.174C304.061 362.978 307.911 364 312 364C325.255 364 338.392 350.213 338.392 336.958C341.183 293.87 345.548 248.155 351.199 195.953C351.02 192.723 352.274 189.482 354.888 187.26C359.387 183.436 366.212 184.075 370.131 188.686C372.349 191.295 373.161 194.616 372.635 197.701C383.786 282.213 389.432 348.508 391.014 408.299C460.56 409.581 526.659 416.219 611 425.5V425.532C613.214 425.882 615.303 426.981 616.855 428.8C620.376 432.925 619.802 439.196 615.572 442.805C613.679 444.42 611.375 445.228 609.091 445.259C554.531 452.62 507.124 457.722 463.225 460.848C463.199 460.958 463.173 461.067 463.147 461.176C451.791 462.581 443 472.264 443 484C443 488.616 444.36 492.914 446.701 496.516C459.086 510.354 471.93 525.108 485.904 541.265L485.89 541.28C486.788 542.423 487.297 543.868 487.233 545.419C487.086 548.935 484.045 551.664 480.441 551.513C478.827 551.446 477.373 550.813 476.274 549.819C457.215 536.385 440.03 523.839 424.202 511.77C420.858 510.002 417.046 509 413 509C399.745 509 389 519.745 389 533C389 534.231 389.093 535.439 389.271 536.62C388.954 536.703 388.637 536.785 388.319 536.865C385.216 584.272 380.022 633.28 373.583 690.764L373.552 690.764C373.197 692.977 372.095 695.064 370.272 696.613C366.14 700.126 359.871 699.539 356.27 695.303Z"
            fill="white"
          />
          <g filter="url(#filter0_d_462:22)">
            <path
              d="M620.603 163.197C622.736 160.357 624 156.826 624 153C624 143.611 616.389 136 607 136C602.816 136 598.985 137.512 596.023 140.019L596 140C402.996 311.06 302.019 402.033 106.511 705.653C104.309 708.519 103 712.107 103 716C103 725.389 110.611 733 120 733C125.889 733 131.079 730.006 134.129 725.456C349.591 539.299 459.523 416.462 620.603 163.197Z"
              fill="#00DEA5"
            />
          </g>
          <g filter="url(#filter1_i_462:22)">
            <circle cx="363" cy="442" r="26" fill="white" />
          </g>
          <defs>
            <filter
              id="filter0_d_462:22"
              x="101"
              y="130"
              width="541"
              height="617"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="8" dy="4" />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_462:22"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_462:22"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_i_462:22"
              x="337"
              y="416"
              width="57"
              height="56"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feMorphology
                radius="1"
                operator="erode"
                in="SourceAlpha"
                result="effect1_innerShadow_462:22"
              />
              <feOffset dx="5" dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_462:22"
              />
            </filter>
          </defs>
        </svg>
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 208 213"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.804321 28.9403C0.804321 13.3011 13.4825 0.622925 29.1217 0.622925H104.05C161.071 0.622925 207.296 46.8477 207.296 103.869V109.131C207.296 166.152 161.071 212.377 104.05 212.377H29.1217C13.4825 212.377 0.804321 199.699 0.804321 184.06V28.9403Z"
            fill="#11042C"
          />
          <path
            d="M90.0844 174.863C89.6805 174.388 89.479 173.81 89.4726 173.238C86.5285 151.092 85.059 133.65 84.7727 117.032C68.019 116.767 51.1045 115.352 29.932 113.102C29.1226 113.148 28.3099 112.835 27.7517 112.181C26.7913 111.056 26.948 109.345 28.1017 108.361C28.7544 107.804 29.5862 107.599 30.3595 107.729C44.4224 105.846 56.4726 104.575 67.3698 103.809C69.7543 103.01 71.4725 100.758 71.4725 98.105C71.4725 97.1076 71.2298 96.167 70.8001 95.3389C67.7024 91.9348 64.4795 88.2912 61.0152 84.316C60.6098 83.9808 60.3612 83.4734 60.3845 82.9158C60.4244 81.9565 61.254 81.2121 62.2373 81.2531C62.7935 81.2763 63.2798 81.5458 63.5901 81.9492C68.2063 85.2098 72.3599 88.2453 76.1566 91.1319C77.0009 91.5838 77.9658 91.84 78.9904 91.84C82.312 91.84 85.6042 88.385 85.6042 85.0634C86.3035 74.2657 87.3975 62.8096 88.8135 49.728C88.7688 48.9186 89.0829 48.1065 89.7381 47.5495C90.8655 46.5913 92.5757 46.7513 93.5579 47.907C94.1136 48.5607 94.3173 49.3929 94.1853 50.166C96.9797 71.3445 98.3946 87.9577 98.7911 102.941C116.219 103.263 132.783 104.926 153.919 107.252V107.26C154.474 107.347 154.997 107.623 155.386 108.079C156.268 109.112 156.124 110.684 155.065 111.588C154.59 111.993 154.013 112.196 153.44 112.203C139.768 114.048 127.888 115.327 116.887 116.11L116.867 116.192C114.022 116.544 111.819 118.97 111.819 121.912C111.819 123.068 112.159 124.145 112.746 125.048C115.85 128.516 119.068 132.213 122.57 136.262L122.567 136.266C122.792 136.552 122.919 136.914 122.903 137.303C122.866 138.184 122.104 138.868 121.201 138.83C120.797 138.813 120.432 138.655 120.157 138.406C115.381 135.039 111.074 131.895 107.108 128.871C106.27 128.427 105.315 128.177 104.301 128.177C100.979 128.177 98.2864 130.869 98.2864 134.191C98.2864 134.499 98.3096 134.802 98.3543 135.098C98.2749 135.119 98.1953 135.139 98.1156 135.159C97.338 147.039 96.0366 159.321 94.423 173.726L94.4151 173.726C94.3262 174.281 94.0499 174.804 93.5933 175.192C92.5577 176.072 90.9867 175.925 90.0844 174.863Z"
            fill="#6A39EC"
          />
          <g filter="url(#filter0_d_308_2854)">
            <path
              d="M156.325 41.5195C156.86 40.8076 157.177 39.9228 157.177 38.9641C157.177 36.6112 155.269 34.7039 152.916 34.7039C151.868 34.7039 150.908 35.0827 150.166 35.711L150.16 35.7063C101.794 78.5734 76.4892 101.371 27.4955 177.457C26.9437 178.175 26.6157 179.074 26.6157 180.05C26.6157 182.403 28.5231 184.31 30.8759 184.31C32.3516 184.31 33.6521 183.56 34.4166 182.42C88.4106 135.769 115.959 104.987 156.325 41.5195Z"
              fill="#00DEA5"
            />
          </g>
          <g filter="url(#filter1_i_308_2854)">
            <circle cx="91.7709" cy="109.382" r="6.51551" fill="#6A39EC" />
          </g>
          <defs>
            <filter
              id="filter0_d_308_2854"
              x="26.1145"
              y="33.2003"
              width="135.573"
              height="154.618"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="2.00477" dy="1.00239" />
              <feGaussianBlur stdDeviation="1.25298" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_308_2854"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_308_2854"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_i_308_2854"
              x="85.2554"
              y="102.866"
              width="14.284"
              height="14.0334"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feMorphology
                radius="0.250597"
                operator="erode"
                in="SourceAlpha"
                result="effect1_innerShadow_308_2854"
              />
              <feOffset dx="1.25298" dy="1.00239" />
              <feGaussianBlur stdDeviation="0.501193" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_308_2854"
              />
            </filter>
          </defs>
        </svg>
      )}
    </Box>
  );
}

export default LogoIcon;
