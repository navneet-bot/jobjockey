import { NextResponse } from "next/server";

export async function GET() {
    // This is a dummy route to catch and silence ghost requests made by 
    // browser extensions (like ad blockers or marketing tools) to this endpoint,
    // which were previously polluting the terminal with 404 errors.
    return NextResponse.json({ status: "ignored" }, { status: 200 });
}
