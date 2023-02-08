import { ISvgProps } from "./types";

const BinanceIcon = ({ width = 24, height = 24 }: ISvgProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.4639 1.41699L16.4487 4.47379L8.93263 11.9899L5.94775 9.00504L13.4639 1.41699Z"
        fill="#F0B90B"
        stroke="#F0B90B"
      />
      <path
        d="M17.9951 5.94824L20.98 9.00504L8.93263 21.0524L5.94775 18.0675L17.9951 5.94824Z"
        fill="#F0B90B"
        stroke="#F0B90B"
      />
      <path
        d="M4.40138 10.4795L7.38625 13.5363L4.40138 16.5212L1.4165 13.5363L4.40138 10.4795Z"
        fill="#F0B90B"
        stroke="#F0B90B"
      />
      <path
        d="M22.5264 10.4795L25.5112 13.5363L13.4639 25.5837L10.479 22.5988L22.5264 10.4795Z"
        fill="#F0B90B"
        stroke="#F0B90B"
      />
    </svg>
  );
};

export default BinanceIcon;
