"use server";

export async function getAddressFromCoords(lat: number, lon: number): Promise<string | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            {
                headers: {
                    "User-Agent": "Jan-Mitra-App/1.0", // Nominatim requires a User-Agent
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch address");
        }

        const data = await response.json();

        // Construct a readable address
        const address = data.display_name;
        return address || "Unknown Location";
    } catch (error) {
        console.error("Reverse Geocoding Error:", error);
        return null;
    }
}
