import type { User } from "../../../types";

export default async function GetUser(token: string): Promise<User | null> {
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiUrl}/getUser`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 200) {
    let data = await res.json();
    return data.user;
  } else {
    return null;
  }
}
