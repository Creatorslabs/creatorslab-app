import { useSolanaConnection } from "@/components/context/SolanaConnectionContext";
import { useEffect, useState, useCallback } from "react";

type Balances = {
  compiled: string;
  sol: string;
  usdc: string;
  cls: string;
};

const defaultBalances: Balances = {
  compiled: "0",
  sol: "0",
  usdc: "0",
  cls: "0",
};

export function useUserBalances() {
  const [balances, setBalances] = useState<Balances>(defaultBalances);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { network } = useSolanaConnection();

  const fetchBalances = useCallback(async () => {
    if (!network) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/balances?network=${network}`);

      if (!res.ok) throw new Error(`Failed to fetch balances (${res.status})`);

      const data = await res.json();

      setBalances({
        compiled: data.balances?.compiled || "0",
        sol: data.balances?.sol || "0",
        usdc: data.balances?.usdc || "0",
        cls: data.balances?.cls || "0",
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching balances:", err);
      setError((err as Error).message);
      setBalances(defaultBalances);
    } finally {
      setIsLoading(false);
    }
  }, [network]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return {
    balances,
    isLoading,
    error,
    refreshBalances: fetchBalances,
  };
}
