import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const roles = ["Full-Stack Developer", "React Enthusiast", "Next.JS Expert"];

/**
 * Scattered decorative shapes — absolute-positioned, slow-drifting.
 */
const shapes = [
    // Circles
    {
        type: "circle",
        className: "top-[12%] left-[8%] size-3 rounded-full bg-primary/25",
        drift: { y: [0, -14, 0], x: [0, 6, 0] },
        dur: 10,
    },
    {
        type: "circle",
        className: "top-[22%] right-[15%] size-2 rounded-full bg-secondary/30",
        drift: { y: [0, 10, 0], x: [0, -8, 0] },
        dur: 12,
    },
    {
        type: "circle",
        className:
            "bottom-[25%] left-[12%] size-4 rounded-full border border-primary/20",
        drift: { y: [0, 12, 0] },
        dur: 14,
    },
    {
        type: "circle",
        className:
            "bottom-[18%] right-[10%] size-2.5 rounded-full bg-accent/30",
        drift: { y: [0, -10, 0], x: [0, 5, 0] },
        dur: 11,
    },
    // Squares (rotated)
    {
        type: "square",
        className:
            "top-[30%] left-[18%] size-3 rotate-45 rounded-sm bg-secondary/15",
        drift: { y: [0, 8, 0], rotate: [45, 90, 45] },
        dur: 16,
    },
    {
        type: "square",
        className:
            "top-[15%] right-[22%] size-2.5 rotate-12 rounded-sm border border-accent/20",
        drift: { y: [0, -6, 0], rotate: [12, 60, 12] },
        dur: 13,
    },
    {
        type: "square",
        className:
            "bottom-[30%] right-[18%] size-2 rotate-45 rounded-sm bg-primary/15",
        drift: { y: [0, 10, 0], rotate: [45, 0, 45] },
        dur: 15,
    },
    // Triangles (using border trick)
    {
        type: "triangle",
        className: "top-[40%] left-[6%]",
        drift: { y: [0, -8, 0], x: [0, 4, 0] },
        dur: 12,
    },
    {
        type: "triangle",
        className: "bottom-[35%] right-[8%]",
        drift: { y: [0, 12, 0], x: [0, -6, 0] },
        dur: 14,
    },
    // Plus signs
    {
        type: "plus",
        className: "top-[55%] left-[15%]",
        drift: { y: [0, 6, 0], rotate: [0, 90, 0] },
        dur: 18,
    },
    {
        type: "plus",
        className: "top-[20%] right-[30%]",
        drift: { y: [0, -10, 0], rotate: [0, -90, 0] },
        dur: 20,
    },
    // Ring
    {
        type: "circle",
        className:
            "top-[60%] right-[25%] size-5 rounded-full border border-dashed border-secondary/15",
        drift: { y: [0, -8, 0], rotate: [0, 180, 0] },
        dur: 22,
    },
];

export function Landing({ className, ...props }: GenericProps) {
    return (
        <section
            className={cn(
                "relative flex h-full min-h-screen items-center justify-center",
                className
            )}
            {...props}
        >
            {/* Decorative layer — clipped so orbs/shapes don't overflow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Dot grid background */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, currentColor 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Floating gradient orbs */}
                <motion.div
                    className="absolute -top-40 -left-40 size-[600px] rounded-full bg-primary/15 blur-[120px]"
                    animate={{
                        x: [0, 60, 0],
                        y: [0, 40, 0],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute -right-32 -bottom-20 size-[500px] rounded-full bg-secondary/15 blur-[120px]"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, -60, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 size-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[100px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />

                {/* Scattered geometric shapes */}
                {shapes.map((shape, i) => {
                    if (shape.type === "triangle") {
                        return (
                            <motion.div
                                key={i}
                                className={cn("absolute", shape.className)}
                                animate={shape.drift}
                                transition={{
                                    duration: shape.dur,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <div className="size-0 border-x-[5px] border-b-[9px] border-x-transparent border-b-primary/20" />
                            </motion.div>
                        );
                    }
                    if (shape.type === "plus") {
                        return (
                            <motion.div
                                key={i}
                                className={cn(
                                    "absolute text-muted-foreground/15",
                                    shape.className
                                )}
                                animate={shape.drift}
                                transition={{
                                    duration: shape.dur,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 10 10"
                                    fill="currentColor"
                                >
                                    <rect x="4" y="0" width="2" height="10" />
                                    <rect x="0" y="4" width="10" height="2" />
                                </svg>
                            </motion.div>
                        );
                    }
                    return (
                        <motion.div
                            key={i}
                            className={cn("absolute", shape.className)}
                            animate={shape.drift}
                            transition={{
                                duration: shape.dur,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}

                {/* Decorative lines */}
                <motion.div
                    className="absolute top-1/4 left-[10%] h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent md:w-48"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 1 }}
                />
                <motion.div
                    className="absolute right-[10%] bottom-1/3 h-px w-24 bg-gradient-to-r from-transparent via-secondary/30 to-transparent md:w-40"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 1.3 }}
                />
            </div>
            {/* end decorative layer */}

            {/* Content */}
            <div className="z-10 flex flex-col items-center gap-6 px-5">
                {/* Eyebrow label */}
                <motion.p
                    className="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                >
                    Portfolio &bull; 2026
                </motion.p>

                {/* Main title — letter-by-letter reveal: V → R,G → D,O */}
                <h1 className="text-gradient text-center font-[family-name:var(--font-syne)] text-[14vw] font-extrabold tracking-tighter md:text-[12rem] md:leading-[0.85]">
                    {"DRVGO".split("").map((letter, i) => {
                        // Stagger order: V(index 2)=0, R(1)&G(3)=1, D(0)&O(4)=2
                        const order = [2, 1, 0, 1, 2][i];
                        const delay = 0.1 + order * 0.2;
                        return (
                            <motion.span
                                key={i}
                                className="inline-block"
                                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 80,
                                    damping: 12,
                                    delay,
                                }}
                            >
                                {letter}
                            </motion.span>
                        );
                    })}
                </h1>

                {/* Subtitle */}
                <motion.p
                    className="max-w-md text-center text-base text-muted-foreground md:text-lg"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                >
                    Crafting seamless web experiences with clean code and
                    creative pixels.
                </motion.p>

                {/* Role pills — simple CSS hover, no motion whileHover */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.3 }}
                >
                    {roles.map((role) => (
                        <span
                            key={role}
                            className="rounded-full border bg-card/80 px-4 py-1.5 text-xs font-medium backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-primary hover:bg-primary hover:text-primary-foreground md:text-sm"
                        >
                            {role}
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
            >
                <motion.div
                    className="h-10 w-[2px] rounded-full bg-gradient-to-b from-primary/50 to-transparent"
                    animate={{
                        scaleY: [1, 0.4, 1],
                        opacity: [0.5, 0.15, 0.5],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>
        </section>
    );
}
