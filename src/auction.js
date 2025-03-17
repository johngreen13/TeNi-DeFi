export const createAuction = async (auction) => {
    try {
        console.log("Received auction object in createAuction():", auction);

        // Simulate sending the auction data to a backend or smart contract
        const response = await fetch("/api/createAuction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(auction),
        });

        if (!response.ok) {
            throw new Error("Failed to create auction");
        }

        console.log("Auction created successfully!");
    } catch (error) {
        console.error("Error in createAuction():", error);
        throw error;
    }
};