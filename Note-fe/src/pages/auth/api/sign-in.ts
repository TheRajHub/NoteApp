import usePersistStore from "../../../store/usePresisitStore";
import type { User } from "../../../types";

export default async function SignIn(
  email: string,
  otp: string
): Promise<[number, User | string]> {
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiUrl}/otp/verifyOtp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });
  if (res.status === 200) {
    let { user, token }: { user: User; token: string } = await res.json();
    usePersistStore.getState().setToken(token);
    return [res.status, user];
  } else {
    let { error }: { error: string } = await res.json();
    return [res.status, error];
  }
}
