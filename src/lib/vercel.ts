// Vercel API integration for custom domains

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_API_URL = "https://api.vercel.com";

interface VercelDomainResponse {
  name: string;
  apexName: string;
  verified: boolean;
  error?: { code: string; message: string };
}

export async function addDomainToVercel(domain: string): Promise<{ success: boolean; error?: string }> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    console.error("Vercel credentials not configured");
    return { success: false, error: "Vercel not configured" };
  }

  try {
    const response = await fetch(
      `${VERCEL_API_URL}/v10/projects/${VERCEL_PROJECT_ID}/domains`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: domain }),
      }
    );

    const data: VercelDomainResponse = await response.json();

    if (response.ok) {
      console.log(`Domain ${domain} added to Vercel`);
      return { success: true };
    }

    // Domain already exists is not an error for us
    if (data.error?.code === "domain_already_in_use") {
      console.log(`Domain ${domain} already exists in Vercel`);
      return { success: true };
    }

    console.error("Vercel API error:", data.error);
    return { success: false, error: data.error?.message || "Failed to add domain" };
  } catch (error) {
    console.error("Error adding domain to Vercel:", error);
    return { success: false, error: "Failed to connect to Vercel" };
  }
}

export async function removeDomainFromVercel(domain: string): Promise<{ success: boolean; error?: string }> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    console.error("Vercel credentials not configured");
    return { success: false, error: "Vercel not configured" };
  }

  try {
    const response = await fetch(
      `${VERCEL_API_URL}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    );

    if (response.ok || response.status === 404) {
      console.log(`Domain ${domain} removed from Vercel`);
      return { success: true };
    }

    const data = await response.json();
    console.error("Vercel API error:", data.error);
    return { success: false, error: data.error?.message || "Failed to remove domain" };
  } catch (error) {
    console.error("Error removing domain from Vercel:", error);
    return { success: false, error: "Failed to connect to Vercel" };
  }
}

export async function getDomainConfig(domain: string): Promise<{
  verified: boolean;
  configured: boolean;
  error?: string;
}> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return { verified: false, configured: false, error: "Vercel not configured" };
  }

  try {
    const response = await fetch(
      `${VERCEL_API_URL}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return { verified: false, configured: false };
    }

    const data = await response.json();
    return {
      verified: data.verified === true,
      configured: true,
    };
  } catch (error) {
    console.error("Error checking domain config:", error);
    return { verified: false, configured: false, error: "Failed to check domain" };
  }
}
