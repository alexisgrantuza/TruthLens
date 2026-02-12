// frontend/src/lib/walletClient.ts
import { BrowserProvider } from "ethers";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

interface WalletAuthResult {
  success: boolean;
  user?: any;
  isNewUser?: boolean;
  error?: string;
}

/**
 * Sign in with Web3 wallet (MetaMask, etc.)
 */
export async function signInWithWallet(): Promise<WalletAuthResult> {
  try {
    // Check if wallet is available
    if (!window.ethereum) {
      return {
        success: false,
        error: "Please install MetaMask or another Web3 wallet",
      };
    }

    const provider = new BrowserProvider(window.ethereum);

    // Request account access
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    // Step 1: Get nonce from backend
    const nonceResponse = await axios.post(`${API_URL}/api/wallet/nonce`, {
      address,
      chainId: network.chainId,
    });

    const { message, nonce } = nonceResponse.data;

    // Step 2: Sign message with wallet
    const signature = await signer.signMessage(message);

    // Step 3: Verify signature and create session
    const verifyResponse = await axios.post(`${API_URL}/api/wallet/verify`, {
      message,
      signature,
      nonce,
    });

    return {
      success: true,
      user: verifyResponse.data.user,
      isNewUser: verifyResponse.data.isNewUser,
    };
  } catch (error: any) {
    console.error("Wallet sign-in error:", error);

    let errorMessage = "Failed to sign in with wallet";

    if (error.code === 4001) {
      errorMessage = "Wallet connection rejected by user";
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Connect wallet to existing authenticated user
 */
export async function connectWalletToAccount(
  userId: string
): Promise<WalletAuthResult> {
  try {
    if (!window.ethereum) {
      return {
        success: false,
        error: "Please install MetaMask or another Web3 wallet",
      };
    }

    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    // Get nonce
    const nonceResponse = await axios.post(`${API_URL}/api/wallet/nonce`, {
      address,
      chainId: network.chainId,
    });

    const { message, nonce } = nonceResponse.data;

    // Sign message
    const signature = await signer.signMessage(message);

    // Connect wallet
    const connectResponse = await axios.post(`${API_URL}/api/wallet/connect`, {
      message,
      signature,
      nonce,
      userId,
    });

    return {
      success: true,
      user: connectResponse.data,
    };
  } catch (error: any) {
    console.error("Wallet connection error:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Failed to connect wallet",
    };
  }
}

/**
 * Disconnect wallet from account
 */
export async function disconnectWallet(userId: string): Promise<boolean> {
  try {
    await axios.post(`${API_URL}/api/wallet/disconnect`, { userId });
    return true;
  } catch (error) {
    console.error("Wallet disconnection error:", error);
    return false;
  }
}

/**
 * Get current wallet address
 */
export async function getCurrentWalletAddress(): Promise<string | null> {
  try {
    if (!window.ethereum) return null;

    const provider = new BrowserProvider(window.ethereum);

    // In v6, listAccounts returns an array of JsonRpcSigner objects
    const accounts = await provider.listAccounts();

    if (accounts.length === 0) return null;

    // Access the 'address' property of the first signer object
    return accounts[0].address;
  } catch (error) {
    console.error("Failed to get wallet address:", error);
    return null;
  }
}

// Extend window type for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
