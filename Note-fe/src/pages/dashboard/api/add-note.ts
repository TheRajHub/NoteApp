export default async function AddNote(
  token: string,
  note: string,
  title: string
): Promise<string | null> {
  const apiUrl = import.meta.env.VITE_API_URL;
  try {
    const res = await fetch(`${apiUrl}/notes/add`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note, title }),
    });
    if (res.status !== 200) {
      return null;
    }
    let data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
