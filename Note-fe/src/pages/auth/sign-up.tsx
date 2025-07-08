import { useCallback, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import image from "/login-image.png";
import GetOTP from "./api/get-otp";
import SignUp from "./api/sign-up";
import useStore from "../../store/useStore";
import { useNavigate } from "react-router-dom";

const SignUpPage = ({ setToggle }: { setToggle: (a: boolean) => void }) => {
  const theme = useTheme();
  const navigator = useNavigate();
  const { setUser } = useStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
  });
  const handleGetOtp = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetOTP(formData.email);
      if (res[0] === 200) {
        setShowOtp(true);
      } else {
        alert(res[1]);
      }
    } catch (err) {
      console.log("Error " + err);
    }
    setLoading(false);
  }, [formData.email]);
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSignUp = useCallback(async () => {
    setLoading(true);
    try {
      const res = await SignUp(
        formData.email,
        new Date(formData.dateOfBirth),
        formData.name,
        otp
      );
      setFormData({ name: "", dateOfBirth: "", email: "" });
      setOtp("");
      setShowOtp(false);
      if (res[0] !== 200) {
        alert(res[1]);
        setLoading(false);
        return;
      }
      if (typeof res[1] == "string") return;
      setUser(res[1]);
      navigator("/dash", { replace: true });
    } catch (err) {
      console.log("Error " + err);
    }
    setLoading(false);
  }, [formData, otp]);

  return (
    <Box sx={{ minHeight: "100%", display: "flex" }}>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          py: 2,
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
            minHeight: "80vh",
          }}
        >
          {/* Left Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Card
              sx={{
                width: "100%",
                maxWidth: 400,
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Logo */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      width: 37,
                      height: 37,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      HD
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", mb: 1, color: "#333" }}
                >
                  Sign up
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                  Sign up to enjoy the feature of HD
                </Typography>

                <Box component="form" sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    disabled={loading}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Date of Birth"
                    disabled={loading}
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    disabled={loading}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    sx={{ mb: showOtp ? 2 : 3 }}
                  />

                  {showOtp && (
                    <TextField
                      fullWidth
                      label="Enter OTP"
                      value={otp}
                      disabled={loading}
                      onChange={(e) => setOtp(e.target.value)}
                      sx={{ mb: 3 }}
                      placeholder="Enter 6-digit OTP"
                    />
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={showOtp ? handleSignUp : handleGetOtp}
                    disabled={loading}
                    sx={{
                      background:
                        "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      py: 1.5,
                      borderRadius: 2,
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                      },
                    }}
                  >
                    {showOtp ? "Sign Up" : "Get OTP"}
                  </Button>

                  <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Already have an account?{" "}
                      <Link
                        href="#"
                        sx={{ color: "#2196F3", textDecoration: "none" }}
                        onClick={() => setToggle(true)}
                      >
                        Sign in
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right Section */}
          {!isMobile && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={image}
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  animation: "pulse 3s ease-in-out infinite reverse",
                }}
              />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SignUpPage;
