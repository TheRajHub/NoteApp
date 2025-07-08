export default async function GetOTP(email: string): Promise<[number, string]> {
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiUrl}/otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const msg: string = await res.json();
  return [res.status, msg];
}
