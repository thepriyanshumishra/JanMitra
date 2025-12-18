import { ethers } from "ethers";

// Polygon Amoy Testnet Configuration
const AMOY_RPC_URL = "https://rpc-amoy.polygon.technology/";
const CHAIN_ID = 80002;

// Contract Address (Placeholder - User needs to deploy)
// We will use a dummy address or ask user to deploy. 
// For now, we'll export a function to get the provider.
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

export const getProvider = () => {
    return new ethers.JsonRpcProvider(AMOY_RPC_URL);
};

export const getSigner = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        return provider.getSigner();
    }
    return null;
};

// ABI (Minimal for registration)
export const GRIEVANCE_REGISTRY_ABI = [
    "function registerGrievance(string memory _id, string memory _dataHash) public",
    "event GrievanceRegistered(string indexed id, string dataHash, uint256 timestamp)"
];
