import { useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import SignUpPageView from "./SignUpPageView";

const SignUpPage = () => {
  const [signUpPageState, setsignUpPageState] = useState({
    formData: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    isShowPassword: false,
    isShowConfirmPassword: false,
    isChecked: false,
    errors: {}
  })

  const { signup } = useAuthStore();

  const validateForm = () => {
    let errors = {};

    if(!signUpPageState.formData.name.trim()) {
      errors = {
        ...errors,
        name: "Name is required",
      }
    }

    if (!signUpPageState.formData.email.trim()) {
      errors = {
        ...errors,
        email: "Email is required",
      }
    }
    if (!/\S+@\S+\.\S+/.test(signUpPageState.formData.email)) {
      errors = {
        ...errors,
        email: "Invalid email format",
      }
    }

    if (!signUpPageState.formData.password) {
      errors = {
        ...errors,
        password: "Password is required",
      }
    }
    if (signUpPageState.formData.password.length < 6) {
      errors = {
        ...errors,
        password: "Password must be at least 6 characters long",
      }
    }

    if (!signUpPageState.formData.confirmPassword) {
      errors = {
        ...errors,
        confirmPassword: "Confirm Password is required",
      }
    }

    if (signUpPageState.formData.password !== signUpPageState.formData.confirmPassword) {
      errors = {
        ...errors,
        confirmPassword: "Passwords do not match",
      }
    }

    if (Object.keys(errors).length > 0) {
      setsignUpPageState((prevState) => ({
        ...prevState,
        errors
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();

    const newFormData = {
      email: signUpPageState.formData.email,
      name: signUpPageState.formData.name,
      password: signUpPageState.formData.password,
    }

    if (success === true) {
      setsignUpPageState((prevState) => ({
        ...prevState,
        errors: {},
      }));

      try {
        await signup(newFormData);
      } catch (error) {
        const message = error?.response?.data?.message || "Signup failed";

        setsignUpPageState((prevState) => ({
          ...prevState,
          errors: {
            ...prevState.errors,
            auth: message,
          },
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setsignUpPageState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  const handleShowPassword = (name) => {
    if(name === "password") {
      setsignUpPageState((prevState) => ({
        ...prevState,
        isShowPassword: !prevState.isShowPassword,
      }));
    } else {
      setsignUpPageState((prevState) => ({
        ...prevState,
        isShowConfirmPassword: !prevState.isShowConfirmPassword,
      }));
    }
  };

  const handleCheck = () => {
    setsignUpPageState((prevState) => ({
      ...prevState,
      isChecked: !prevState.isChecked,
    }));
  };

  return (
    <SignUpPageView
      {...signUpPageState}
      signUpPageState={signUpPageState}
      setsignUpPageState={setsignUpPageState}
      handleCheck={handleCheck}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleShowPassword={handleShowPassword}
    />
  )
}

export default SignUpPage;