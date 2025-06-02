import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button } from "@mui/material";
import { z } from "zod/v4";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../contexts/auth/authContext";

const schema = z.object({
  email: z.email("Invalid email").min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export type LoginInputs = z.infer<typeof schema>;

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: LoginInputs) => {
    const userData = {
      username: data.email,
      email: data.email,
      lastLogin: new Date().toISOString(),
      userType: "admin",
      uid: uuidv4(),
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/templates");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <TextField
        label="Email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        type="password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={!isValid}
        type="submit"
      >
        Login
      </Button>
    </form>
  );
}

export default Login;
