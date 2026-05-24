import React from "react";

export const Button = React.forwardRef(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      children,
      ...props
    },
    ref,
  ) => {
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-size-${size}`;
    const combinedClassName =
      `btn ${variantClass} ${sizeClass} ${className}`.trim();

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
