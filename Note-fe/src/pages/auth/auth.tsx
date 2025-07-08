import { useEffect, useState } from "react";
import SignInPage from "./sign-in";
import SignUpPage from "./sign-up";
import usePersistStore from "../../store/usePresisitStore";
import GetUser from "./api/get-user";
import useStore from "../../store/useStore";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { token, setToken } = usePersistStore();
  const { setUser } = useStore();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await GetUser(token ?? "");
      if (!res) {
        setToken(null);
        return;
      }
      setUser(res);
      navigate("/dash", { replace: true });
    };

    if (token) {
      fetchUser();
    }
  }, [token, setToken, setUser, navigate]);

  if (token) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h1">Loading..</Typography>
      </Box>
    );
  }

  return toggle ? (
    <SignInPage setToggle={setToggle} />
  ) : (
    <SignUpPage setToggle={setToggle} />
  );
}
