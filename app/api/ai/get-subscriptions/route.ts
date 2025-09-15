import Replicate from "replicate";
import { NextResponse } from "next/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { emails } = await request.json();
    
    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { error: "Invalid input: emails array is required" },
        { status: 400 }
      );
    }

    // Prepare email data for the prompt
    const emailsData = emails.map(email => ({
      id: email.id,
      from: email.from,
      subject: email.subject,
      date: email.date,
      snippet: email.snippet,
      service: email.service,
      amount: email.amount,
      recurringType: email.recurringType
    }));

    console.log(JSON.stringify(emailsData, null, 2));

    const prompt = `
      You are an AI assistant that analyzes subscription emails. Based on the following email data,
      extract and complete subscription information for each email.
      
      For each email, provide the following information:
      - id: The original email ID
      - service: The subscription service provider name (e.g., Netflix, Spotify, Apple)
      - amount: The subscription amount with currency symbol
      - renewalDate: The next renewal date in YYYY-MM-DD format
      - frequency: The renewal frequency (monthly, yearly, etc.)
      - category: The category of the subscription (entertainment, productivity, etc.)
      
      Email data:
      ${JSON.stringify(emailsData, null, 2)}
      
      Respond with ONLY a valid JSON array of subscription objects WITHOUT any explanation or extra text. Format:
      [
        {
          "id": "email_id",
          "service": "Service Name",
          "amount": "$9.99",
          "renewalDate": "YYYY-MM-DD",
          "frequency": "monthly",
          "category": "entertainment"
        }
      ]
    `;

    const input = {
      top_k: 50,
      top_p: 0.9,
      prompt,
      max_tokens: 2048,
      min_tokens: 0,
      temperature: 0.2,
      presence_penalty: 0,
      frequency_penalty: 0
    };

    const output = await replicate.run("ibm-granite/granite-3.3-8b-instruct", { input });
    
    // Parse the output, which should be JSON
    let enrichedSubscriptions;
    try {
      // The output might be a string or already parsed JSON
      const outputText = typeof output === 'string' ? output : JSON.stringify(output);
      
      // Find JSON array in the response if it contains other text
      const jsonMatch = outputText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : outputText;
      
      // Try to parse the JSON string
      try {
        enrichedSubscriptions = JSON.parse(jsonString);
      } catch (parseError) {
        // If direct parsing fails, try to clean the string
        const cleanedString = jsonString
          .replace(/\n/g, '')
          .replace(/\r/g, '')
          .replace(/\t/g, '')
          .replace(/\\/g, '\\\\')
          .replace(/"\s*\+\s*"/g, '') // Handle string concatenation
          .replace(/,\s*}/g, '}')     // Handle trailing commas
          .replace(/,\s*\]/g, ']');   // Handle trailing commas in arrays
        
        enrichedSubscriptions = JSON.parse(cleanedString);
      }

      console.log("Enriched subscriptions:");
      console.log(JSON.stringify(enrichedSubscriptions, null, 2));
      
      // Validate structure and provide defaults
      if (Array.isArray(enrichedSubscriptions)) {
        enrichedSubscriptions = enrichedSubscriptions.map(sub => ({
          id: sub.id || "",
          service: sub.service || "Unknown Service",
          amount: sub.amount || "$0.00",
          renewalDate: sub.renewalDate || new Date().toISOString().split('T')[0],
          frequency: sub.frequency || "unknown",
          category: sub.category || "other"
        }));
      } else {
        throw new Error("LLM did not return an array of subscriptions");
      }
    } catch (error) {
      console.error("Failed to parse LLM output:", output);
      return NextResponse.json(
        { error: "Failed to parse subscription data", rawOutput: output },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscriptions: enrichedSubscriptions });
  } catch (error) {
    console.error("Error processing subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to process subscription data" },
      { status: 500 }
    );
  }
}