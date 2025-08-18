import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getChatbotResponse } from "~/utils/chatbot.server";
export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== "POST") {
        return json({ error: "Method not allowed" }, { status: 405 });
    }
    const { message } = await request.json();
    if (typeof message !== "string" || message.trim() === "") {
        return json({ error: "Message is required" }, { status: 400 });
    }
    try {
        const reply = await getChatbotResponse(message);
        return json({ reply });
    } catch (error) {
        console.error("Chatbot API error:", error);
        return json({ error: "Failed to get a response from the chatbot." }, { status: 500 });
    }
};