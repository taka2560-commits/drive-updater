import * as React from "react";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children?: React.ReactNode;
  /** px padding. Default 16. */
  padding?: number | string;
  /** flat / sm / md / lg drop-shadow. */
  elevation?: "flat" | "sm" | "md" | "lg";
  /** Glow border with accent color. */
  selected?: boolean;
  /** Adds hover state + cursor. */
  interactive?: boolean;
}

export function Card(props: CardProps): JSX.Element;
