import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Eye, EyeOff, Mail } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

import LoginImage from "../../assets/login2.png";
import { useAuth } from "../contexts/AuthContext";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Required"),
});

export type LoginInputs = z.infer<typeof schema>;

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const onSubmit = (data: LoginInputs) => {
    const userData = {
      name: data.email,
      email: data.email,
      lastLogin: new Date().toISOString(),
      isAdmin: true,
      uid: uuidv4(),
    };

    localStorage.setItem("adminPanelUser", JSON.stringify(userData));
    login({ ...userData, id: Date.now().toString() });
    navigate("/templates");
  };

  return (
    <div className="w-full h-[100vh] flex flex-1 bg-primary-100 p-4">
      <div className="w-2/5 h-full flex items-center justify-center bg-white rounded-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 p-8 w-2/3 h-1/2 items-center justify-center"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-neutral-800">Login</h1>
            <h1 className="text-xl text-neutral-800">
              Welcome to DocGen Forms Designer
            </h1>
          </div>
          <div className="flex flex-col gap-8 w-full">
            <TextField
              fullWidth
              label="Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="start">
                      <Mail />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <div className="flex flex-col gap-2">
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <div className="flex flex-row justify-between items-center">
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Remember me"
                />
                <a
                  href="/forgot-password"
                  className="text-primary-600 hover:text-primary-700 transition-colors ml-auto"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
          </div>
          <button
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors randed-lg w-1/2"
            disabled={!isValid}
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
      <div className="w-3/5 h-full flex items-center">
        <img src={LoginImage} alt="Description" className="w-full h-2/3" />
      </div>
    </div>
  );
}

export default Login;
