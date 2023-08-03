import { ImageResponse, NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const interRegular = fetch(
    new URL("../../../../fonts/Inter-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const interBold = fetch(
    new URL("../../../../fonts/CalSans-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(req: NextRequest) {
    try {
        const fontRegular = await interRegular;
        const fontBold = await interBold;

        const paint = "#fff";

        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        backgroundColor: "black",
                        padding: "30px 40px",
                        gap: "10px",
                        border: "white 1px",
                    }}
                >
                    <div
                        tw="flex absolute right-[300px] -top-20"
                        style={{
                            transform: "rotate(25deg)",
                        }}
                    >
                        <div
                            tw="h-[1000px] w-32 bg-gray-200"
                            className="right-32 h-screen w-32 bg-gray-200"
                        ></div>
                    </div>
                    <div tw="flex items-center absolute top-5 right-5">
                        <svg
                            width="100"
                            viewBox="0 0 2000 2000"
                            fill={"#abcff8"}
                        >
                            <path d="M527.38,876.77,736,695.5c51.23-44.52,51.23-124.06,0-168.58L527.38,345.65c-72.28-62.81-184.91-11.47-184.91,84.29V792.48C342.47,888.24,455.1,939.58,527.38,876.77Z" />
                            <path d="M1470.29,1121.06l-208.61,181.27c-51.23,44.52-51.23,124.07,0,168.58l208.61,181.28c72.28,62.8,184.91,11.46,184.91-84.3V1205.35C1655.2,1109.59,1542.57,1058.25,1470.29,1121.06Z" />
                            <path d="M777.67,735.52,569.06,916.79c-51.23,44.52-51.23,124.07,0,168.58l208.61,181.27c72.29,62.81,184.91,11.47,184.91-84.29V819.81C962.58,724.05,850,672.71,777.67,735.52Z" />
                            <path d="M1428.61,916.79,1220,735.52c-72.29-62.81-184.91-11.47-184.91,84.29v362.54c0,95.76,112.62,147.1,184.91,84.29l208.61-181.27C1479.84,1040.86,1479.84,961.31,1428.61,916.79Z" />
                            <path d="M1472.62,347.82,1264,529.09c-51.23,44.51-51.23,124.06,0,168.58l208.61,181.27c72.28,62.81,184.91,11.47,184.91-84.29V432.11C1657.53,336.35,1544.9,285,1472.62,347.82Z" />
                            <path d="M738.32,1304.5,529.71,1123.23c-72.28-62.81-184.91-11.47-184.91,84.29v362.54c0,95.76,112.63,147.1,184.91,84.29l208.61-181.27C789.55,1428.56,789.55,1349,738.32,1304.5Z" />
                        </svg>
                    </div>

                    <div
                        tw="flex text-white text-7xl"
                        style={{
                            fontFamily: "Cal Sans",
                            fontWeight: "bold",
                        }}
                    >
                        DRVGO
                    </div>

                    <div tw="flex flex-col">
                        <div
                            tw="flex text-white text-2xl font-bold mb-2"
                            style={{
                                fontFamily: "Inter",
                                fontWeight: "normal",
                            }}
                        >
                            @itsdrvgo
                        </div>
                        <div
                            tw="flex text-white text-5xl font-bold w-3/4 leading-tight drop-shadow-md"
                            style={{
                                fontFamily: "Cal Sans",
                                fontWeight: "bold",
                                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
                            }}
                        >
                            The official portfolio of DRVGO - an immersive web
                            development odyssey, unveiling captivating projects
                            and boundless creative ventures.
                        </div>
                    </div>

                    <div tw="flex text-white items-center text-xl">
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 48 48"
                            fill="none"
                        >
                            <path
                                d="M30 44v-8a9.6 9.6 0 0 0-2-7c6 0 12-4 12-11 .16-2.5-.54-4.96-2-7 .56-2.3.56-4.7 0-7 0 0-2 0-6 3-5.28-1-10.72-1-16 0-4-3-6-3-6-3-.6 2.3-.6 4.7 0 7a10.806 10.806 0 0 0-2 7c0 7 6 11 12 11a9.43 9.43 0 0 0-1.7 3.3c-.34 1.2-.44 2.46-.3 3.7v8"
                                stroke={paint}
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M18 36c-9.02 4-10-4-14-4"
                                stroke={paint}
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>

                        <p
                            tw="ml-3"
                            style={{
                                fontFamily: "Inter",
                                fontWeight: "normal",
                            }}
                        >
                            github.com/itsdrvgo/drvgo-portfolio
                        </p>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: "Inter",
                        data: fontRegular,
                        weight: 400,
                        style: "normal",
                    },
                    {
                        name: "Cal Sans",
                        data: fontBold,
                        weight: 700,
                        style: "normal",
                    },
                ],
            }
        );
    } catch (error) {
        error instanceof Error
            ? console.log(error.message)
            : console.log(error);

        return NextResponse.json({
            code: 500,
            message: "Failed to generate image",
        });
    }
}
