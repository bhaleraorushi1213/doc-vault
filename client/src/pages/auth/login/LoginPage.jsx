import { useState } from "react";
import LoginPageView from "./LoginPageView";
import { useAuthStore } from "../../../store/useAuthStore";

const LoginPage = () => {
  const [loginPageState, setLoginPageState] = useState({
    formData: {
      email: "",
      password: "",
    },
    isShowPassword: false,
    errors: {}
  });

  const { login } = useAuthStore();

  const validateForm = () => {
    let errors = {};

    if (!loginPageState.formData.email.trim()) {
      errors = {
        ...errors,
        email: "Email is required",
      }
    }
    if (!/\S+@\S+\.\S+/.test(loginPageState.formData.email)) {
      errors = {
        ...errors,
        email: "Invalid email format",
      }
    }

    if (!loginPageState.formData.password) {
      errors = {
        ...errors,
        password: "Password is required",
      }
    }
    if (loginPageState.formData.password.length < 6) {
      errors = {
        ...errors,
        password: "Password must be at least 6 characters long",
      }
    }

    if (Object.keys(errors).length > 0) {
      setLoginPageState((prevState) => ({
        ...prevState,
        errors
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    const { email, password } = loginPageState.formData;
    e.preventDefault();

    const success = validateForm();

    if (success === true) {
      setLoginPageState((prevState) => ({
        ...prevState,
        errors: {},
      }));

      const loginSuccess = await login({ email, password });

      if (!loginSuccess) {
        setLoginPageState((prevState) => ({
          ...prevState,
          errors: {
            ...prevState.errors,
            auth: "Invalid email or password",
          },
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginPageState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  const handleShowPassword = () => {
    setLoginPageState((prevState) => ({
      ...prevState,
      isShowPassword: !prevState.isShowPassword,
    }));
  };

  return (
    <LoginPageView
      {...loginPageState}
      loginPageState={loginPageState}
      setLoginPageState={setLoginPageState}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleShowPassword={handleShowPassword}
    />
  )
}

export default LoginPage;