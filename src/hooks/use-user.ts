"use client";

import { getUserSession } from "@/lib/user";
import { User } from "@/types";
import { useEffect, useState } from "react";

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {  
      getUserSession()
        .then(session => {
          if(session) setUser(session.user);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : String(err));
        });
    }, []);
  
    return { user, isLoading, error };
  }