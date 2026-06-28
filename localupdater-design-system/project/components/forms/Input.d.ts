import * as React from "react";
import type { IconName } from "../Icon";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  leftIcon?: IconName;
  clearable?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Input(props: InputProps): JSX.Element;
