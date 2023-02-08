import { ISvgProps } from "./types";

const Circle = ({ width = 619, height = 674 }: ISvgProps) => {
  return (
    <svg
      width={619}
      height={674}
      viewBox="0 0 619 674"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_4256_16239)">
        <rect x="10" y="10" width="599" height="654" rx="8" fill="white" />
      </g>
      <defs>
        <filter
          id="filter0_d_4256_16239"
          x="0"
          y="0"
          width="619"
          height="674"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4256_16239"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4256_16239"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Circle;
