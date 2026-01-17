// @/utils/animations.ts
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3
        }
    }
};

export const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    },
    exit: {
        x: 20,
        opacity: 0,
        transition: {
            duration: 0.3
        }
    }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const scaleHover = {
    initial: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: {
            type: "spring",
            stiffness: 400
        }
    },
    tap: {
        scale: 0.95
    }
};

export const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3
        }
    }
};

export const cardHover = {
    initial: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
    },
    hover: {
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        y: -5,
        transition: {
            duration: 0.2,
            type: "spring",
            stiffness: 300
        }
    }
};

export const rotateIcon = {
    hover: {
        rotate: 360,
        transition: {
            duration: 0.6,
            ease: "easeInOut"
        }
    }
};

export const pulseAnimation = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse" as const
        }
    }
};