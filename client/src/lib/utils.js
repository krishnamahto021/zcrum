import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const useConfig = () => {
  const { getToken } = useAuth();
  const [config, setConfig] = useState({
    headers: {
      "Content-type": "application/json",
    },
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const jwtToken = await getToken();
        // console.log(jwtToken);
        console.log(jwtToken);

        setConfig({
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
      } catch (error) {
        console.error("Error fetching JWT token:", error);
      }
    };

    fetchConfig();
  }, [getToken]);

  // Default config without JWT for unauthorized requests
  const configWithoutJWT = {
    headers: {
      "Content-type": "application/json",
    },
  };

  return { configWithJWT: config, configWithoutJWT };
};

export const backendApi = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

export const reOrder = (list, statrtIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(statrtIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
