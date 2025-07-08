type Note = {
  _id: string;
  note: string;
  title: string;
};

type User = {
  email: string;
  data: Date | null;
  name: string;
  notes: Array<Note>;
};

export type { User, Note };
