export default async function DeleteNote(
  token: string,
  noteID: string
): Promise<boolean> {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(noteID);
  try {
    const res = await fetch(`${apiUrl}/notes/delete/${noteID}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (res.status !== 200) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
