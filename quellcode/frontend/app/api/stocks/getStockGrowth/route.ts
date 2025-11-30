import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL } from "@/config";

/**
 * 
 * @param req - The incoming request object containing the token and stock IDs.
 * @param req.json - The request body should contain a JSON object with the token and stockIds.
 * @param req.json.token - The token used to authenticate the request.
 * @param req.json.stockIds - An array of stock IDs for which the growth data is
 * @returns {NextResponse} - The response containing the stock growth data or an error message.
 * @throws {Error} - If the request to the backend fails or if the response is not in the expected format.
 */
export async function POST(req: NextRequest) {
  const { token, stockIds } = await req.json();

  const res = await fetch(`${BACKEND_BASE_URL}/getStockGrowth/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stockIds),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}