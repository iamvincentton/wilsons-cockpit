// React
import { ReactNode, ButtonHTMLAttributes, CSSProperties, memo } from "react";

// Libs
import classnames from "classnames";

// Styles
import styles from "./HUDButton.module.css";

type ButtonSizeEnum = "md" | "xl";

interface HUDButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  children?: ReactNode;
  isLoading?: boolean;
  size?: ButtonSizeEnum;
  style?: CSSProperties;
}

const HUDButtonComponent = ({
  isActive = false,
  children,
  className,
  disabled = false,
  isLoading = false,
  onClick,
  size = "md",
  style,
  type = "submit",
}: HUDButtonProps) => {
  const componentClassNames = classnames(
    styles.hudbutton,
    styles[`hudbutton-${size}`],
    className,
    {
      [styles.hudbuttonLoading]: isLoading,
      [styles.hudbuttonActive]: isActive,
    }
  );

  return (
    <button
      className={componentClassNames}
      disabled={disabled}
      onClick={onClick}
      type={type}
      style={style}
    >
      {children}
    </button>
  );
};

export const HUDButton = memo(HUDButtonComponent);
