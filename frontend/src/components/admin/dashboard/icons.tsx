import { memo, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Memoized 24x24 inline icons used across the admin dashboard panels.
// All draw in `currentColor` so panels tint them with Tailwind text colors.
// ---------------------------------------------------------------------------

interface IconProps {
  size?: number;
}

const makeIcon = (name: string, path: ReactNode) => {
  const Icon = memo(({ size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {path}
    </svg>
  ));
  Icon.displayName = name;
  return Icon;
};

export const BagIcon = makeIcon(
  "BagIcon",
  <path d="M17.5 6h-3.2c-.5-1.2-1.7-2-3.3-2s-2.8.8-3.3 2H3.5C2.7 6 2 6.7 2 7.5S2.7 9 3.5 9h.3l1 10c.1 1.1 1 2 2.2 2h8c1.2 0 2.1-.9 2.2-2l1-10h.3c.8 0 1.5-.7 1.5-1.5S20.3 6 19.5 6h-2zM12 4c.8 0 1.5.5 1.8 1.2h-3.6C10.5 4.5 11.2 4 12 4zm4.7 13.6c0 .1-.1.2-.2.2H7.5c-.1 0-.2-.1-.2-.2l-.9-9h1.7l.5 1.3c.1.3.4.5.7.5h5.2c.3 0 .6-.2.7-.5l.5-1.3h1.7l-.9 9zM10.5 15c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm3 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
);

export const CartIcon = makeIcon(
  "CartIcon",
  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 14.8l.1-.5L8.6 12h7.5c.7 0 1.4-.4 1.7-1l3.9-6.9c.1-.3 0-.7-.3-.9-.1-.1-.3-.1-.4-.1H5.2l-.9-2H1v2h2l3.6 7.6-1.4 2.4c-.1.3-.2.6-.2 1 0 1.1.9 2 2 2h12v-2H7.4c-.1 0-.2-.1-.2-.2z" />
);

export const PeopleIcon = makeIcon(
  "PeopleIcon",
  <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 1.9 1.9 1.9 3.4V19h6v-2.5c0-2.3-4.7-3.5-6.9-3.5z" />
);

export const BoxIcon = makeIcon(
  "BoxIcon",
  <path d="M21 7.5l-9-5-9 5v9l9 5 9-5v-9zM12 3.2l6.5 3.6L12 10.4 5.5 6.8 12 3.2zM4 8.6l7 3.9v6.8l-7-3.9V8.6zm9 10.7v-6.8l7-3.9v6.8l-7 3.9z" />
);

export const ChartIcon = makeIcon(
  "ChartIcon",
  <path d="M4 20h16a1 1 0 0 0 0-2H5V4a1 1 0 0 0-2 0v15a1 1 0 0 0 1 1zm3-5V9h3v6H7zm5 0V6h3v9h-3zm5 0v-4h3v4h-3z" />
);

export const BarsIcon = makeIcon(
  "BarsIcon",
  <path d="M3 20h18a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2zM4 10h3v8H4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2H7v-8a1 1 0 0 0-3 0zm6-4h3v12h-3a1 1 0 0 0 0 2h5a1 1 0 0 0 0-2h-3V6a1 1 0 0 0-2 0zm7-2a1 1 0 0 0-1 1v14a1 1 0 0 0 2 0V5a1 1 0 0 0-1-1z" />
);

export const PieIcon = makeIcon(
  "PieIcon",
  <path d="M11 3.1A8 8 0 1 0 20.9 13H11V3.1zm2 0V11h7.9A8 8 0 0 0 13 3.1z" />
);

export const TargetIcon = makeIcon(
  "TargetIcon",
  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 3a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
);

export const ActivityIcon = makeIcon(
  "ActivityIcon",
  <path d="M3 12h3.6l2.3-6.4L13 18.3l2.4-6.7H21a1 1 0 0 0 0-2h-5.3l-1.7 4.8L11 5.7l-3 8.3H3a1 1 0 0 0 0 2z" />
);

export const ClockIcon = makeIcon(
  "ClockIcon",
  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.2 3.1.8-1.3-4.5-2.6V7z" />
);

export const StarIcon = makeIcon(
  "StarIcon",
  <path d="M12 17.3l-6.2 3.7 1.7-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.5 4.8 1.7 7z" />
);

export const TrendUpIcon = makeIcon(
  "TrendUpIcon",
  <path d="M16 6l2.3 2.3-4.9 4.9-4-4L2 16.6 3.4 18l6-6 4 4 6.3-6.3L22 12V6h-6z" />
);

export const CalendarIcon = makeIcon(
  "CalendarIcon",
  <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
);

export const ChevronDownIcon = makeIcon(
  "ChevronDownIcon",
  <path d="M12 15.4L5.6 9l1.4-1.4 5 5 5-5L18.4 9 12 15.4z" />
);

// `evenodd` punches the exclamation mark out of the triangle body.
export const WarningIcon = makeIcon(
  "WarningIcon",
  <path
    fillRule="evenodd"
    d="M12 2.5 1.8 20.4a1 1 0 0 0 .9 1.6h18.6a1 1 0 0 0 .9-1.6L12 2.5zm-1.1 7.1a1.1 1.1 0 1 1 2.2 0v4.6a1.1 1.1 0 1 1-2.2 0V9.6zm1.1 7.6a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z"
  />
);
