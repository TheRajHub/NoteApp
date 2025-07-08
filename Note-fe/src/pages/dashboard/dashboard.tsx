import { useCallback, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Container,
  IconButton,
  Paper,
  Stack,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { Add as AddIcon, Note as NoteIcon } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import useStore from "../../store/useStore";
import type { Note } from "../../types";
import AddNote from "./api/add-note";
import usePersistStore from "../../store/usePresisitStore";
import DeleteNote from "./api/delete-note";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

export default function Dashboard() {
  const navigator = useNavigate();
  const user = useStore((state) => state.user);
  const { setUser, removeUser } = useStore();
  const { token, removeToken } = usePersistStore();
  if (!token) {
    navigator("/", { replace: true });
  }

  const [notes, setNotes] = useState<Note[]>(user.notes);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const createNote = useCallback(async () => {
    const res = await AddNote(token ?? "", newNoteContent, newNoteTitle);
    if (!res) {
      alert("Not able to Add the Note");
      return;
    }
    let newNote: Note = {
      _id: res ?? "",
      title: newNoteTitle.trim(),
      note: newNoteContent,
    };
    setNotes([...notes, newNote]);
    user.notes.push(newNote);
    setUser(user);
    setIsCreateDialogOpen(false);
    setNewNoteContent("");
    setNewNoteTitle("");
  }, [token, newNoteTitle, newNoteContent]);

  const deleteNote = async (id: string) => {
    const res = await DeleteNote(token ?? "", id);
    if (!res) {
      alert("Unable to Delete");
      return;
    }
    setNotes(notes.filter((note) => note._id !== id));
    user.notes = user.notes.filter((note) => note._id !== id);
    setUser(user);
  };

  const openNoteDetails = (note: Note) => {
    setSelectedNote(note);
    setIsDetailsDialogOpen(true);
  };
  const signOut = () => {
    removeToken();
    removeUser();
    navigator("/", { replace: true });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Header */}
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            {/* Left side: Spinner + Title */}
            <Box display="flex" alignItems="center" flexGrow={1}>
              <StarBorderPurple500Icon
                fontSize="large"
                sx={{ mr: 2, color: theme.palette.primary.main }}
              />
              <Typography variant="h5" color="textPrimary">
                Dashboard
              </Typography>
            </Box>

            {/* Right side: Sign Out */}
            <Button
              onClick={signOut}
              sx={{
                color: theme.palette.primary.main,
                textTransform: "none",
                textDecoration: "underline",
                fontWeight: 500,
                fontSize: "large",
              }}
            >
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="sm" sx={{ py: 3 }}>
          <Stack spacing={3}>
            {/* Welcome Section */}
            <Card key="welcome-card" elevation={2} sx={{ borderRadius: 5 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: 600 }}
                    >
                      Welcome, {user.name}!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email: {user.email}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Create Note Button */}
            <Button
              key="create-note-button"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateDialogOpen(true)}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                borderRadius: 7,
              }}
            >
              Create Note
            </Button>

            {/* Create Note Dialog */}
            <Dialog
              key="create-note-dialog"
              open={isCreateDialogOpen}
              onClose={() => setIsCreateDialogOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Create New Note</DialogTitle>
              <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <TextField
                    autoFocus
                    label="Title"
                    placeholder="Enter note title..."
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Content"
                    placeholder="Write your note here..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Stack>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={createNote}
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  Create Note
                </Button>
              </DialogActions>
            </Dialog>

            {/* Note Details Dialog */}
            <Dialog
              key="note-details-dialog"
              open={isDetailsDialogOpen}
              onClose={() => setIsDetailsDialogOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle sx={{ fontSize: "1.25rem", fontWeight: 600 }}>
                {selectedNote?.title || "Note Details"}
              </DialogTitle>
              <DialogContent>
                {selectedNote && (
                  <Stack spacing={3} sx={{ mt: 1 }}>
                    <Box>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          minHeight: 300,
                          bgcolor: "grey.50",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {selectedNote.note || "No content available"}
                        </Typography>
                      </Paper>
                    </Box>
                  </Stack>
                )}
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                  onClick={() => setIsDetailsDialogOpen(false)}
                  variant="outlined"
                  sx={{ textTransform: "none" }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            {/* Notes Section */}
            <Box key="notes-section">
              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 2, fontWeight: 500 }}
              >
                Notes
              </Typography>

              {notes.length === 0 ? (
                <Card elevation={2}>
                  <CardContent sx={{ textAlign: "center", py: 4 }}>
                    <NoteIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      No notes yet. Create your first note!
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Stack spacing={2}>
                  {notes.map((note) => (
                    <Card
                      key={note._id}
                      elevation={2}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          elevation: 4,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{ flexGrow: 1, minWidth: 0 }}
                            onClick={() => openNoteDetails(note)}
                          >
                            <Typography
                              variant="h6"
                              component="h4"
                              sx={{
                                fontWeight: 500,
                                mb: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {note.title}
                            </Typography>
                            {note.note && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mb: 1,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {note.note}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Note object:", note);
                              console.log("Note ID:", note._id);
                              if (note._id) {
                                deleteNote(note._id);
                              } else {
                                alert("Invalid note ID");
                              }
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
