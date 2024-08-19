import React from "react";

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const variants = {
    default: "btn-default",
    secondary: "btn-secondary",
    destructive: "btn-destructive",
    outline: "btn-outline",
    ghost: "btn-ghost",
    link: "btn-link",
};

const sizes = {
    default: "btn-default-size",
    sm: "btn-sm",
    lg: "btn-lg",
    icon: "btn-icon",
};

type ButtonProps = {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "default", size = "default", children, onClick, disabled }, ref) => {
        return (
            <button
                ref={ref}
                className={cn("btn", variants[variant], sizes[size])}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </button>
        );
    }
);

export default Button;