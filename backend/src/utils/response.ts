import { APIGatewayProxyResult } from "aws-lambda";
import { ApiResponse } from "@/types";

export const createResponse = (
  statusCode: number,
  body: ApiResponse,
  headers: Record<string, string> = {}
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Credentials": true,
      ...headers,
    },
    body: JSON.stringify(body),
  };
};

export const successResponse = (
  data: any,
  message?: string,
  statusCode: number = 200
): APIGatewayProxyResult => {
  return createResponse(statusCode, {
    success: true,
    data,
    message,
  });
};

export const errorResponse = (
  error: string,
  statusCode: number = 400
): APIGatewayProxyResult => {
  return createResponse(statusCode, {
    success: false,
    error,
  });
};
