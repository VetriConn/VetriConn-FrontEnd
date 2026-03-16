/**
 * Contact API Service
 * Contact form and messaging
 */

import { API_BASE_URL } from "./client";
import { API_CONFIG } from "@/lib/api-config";
import type { ContactMessage, MessageResponse } from "@/types/api";

// Send contact message
export async function sendContactMessage(
  messageData: ContactMessage,
): Promise<MessageResponse> {
  // Send contact messages to the backend endpoint so the backend (which
  // already has Resend configured) performs the actual email send.
  // `API_CONFIG.ENDPOINTS.CONTACT.SEND` contains the endpoint path.
  const contactUrl = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT.SEND}`;
  console.log("=== CONTACT API DEBUG ===");
  console.log("Environment:", process.env.NEXT_PUBLIC_NODE_ENV);
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("Full contact URL:", contactUrl);
  console.log("Message data:", messageData);
  console.log("=======================");

  try {
    const response = await fetch(contactUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    console.log(
      "Contact response status:",
      response.status,
      response.statusText,
    );

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.log("Non-JSON response:", textResponse);
      throw new Error(
        `Server returned non-JSON response: ${response.status} ${response.statusText}. Response: ${textResponse}`,
      );
    }

    const data = await response.json();
    console.log("Message response data:", data);

    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to send message");
    }

    return data;
  } catch (error) {
    console.error("Message send error:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Network error: Unable to connect to ${API_BASE_URL}. Please ensure the backend server is running.`,
      );
    }

    throw error;
  }
}
