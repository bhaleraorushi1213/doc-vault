import { ArrowRight, EyeIcon, EyeOffIcon, FileTextIcon, Loader, LockIcon, LockKeyhole, MailIcon, User } from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "../../../store/useAuthStore.js";

const SignUpPageView = (props) => {
  const {
    handleSubmit,
    handleInputChange,
    handleCheck,
    handleShowPassword,
    signUpPageState
  } = props;

  const {
    formData,
    isShowPassword,
    isShowConfirmPassword,
    isChecked,
    errors
  } = signUpPageState;

  const { name, email, password, confirmPassword } = formData;
  const { isSigningUp } = useAuthStore();

  return (
    <div className="h-full flex justify-center md:py-8 bg-[#F8FAFC]">
      <div className="p-8 bg-white md:border md:border-gray-400 rounded-lg w-full md:w-[420px]">
        {/* LOGO */}
        <div className="flex flex-col justify-center items-center gap-4 py-4">
          <div className="bg-blue-800 text-white w-12 h-12 rounded-lg flex justify-center items-center">
            <FileTextIcon />
          </div>
          <h1 className="text-2xl font-bold">DocVault</h1>
          <p>Create your enterprise DMS account</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col">

          {/* FULL NAME */}
          <div className="flex flex-col gap-2 group pb-4">
            <label htmlFor="name">Full Name</label>
            <div className={`flex items-center gap-4 border border-gray-400 rounded-lg px-4 ${errors.name ? "border-red-500 ring-2 ring-red-500/20" : "focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20"} transition-all duration-200`}>
              <User className="size-5" />
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your full name"
                className="py-2 focus:outline-none w-full"
                onChange={handleInputChange}
                value={name}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* EMAIL FEILD */}
          <div className="flex flex-col gap-2 group pb-4">
            <label htmlFor="email">Email</label>
            <div className={`flex items-center gap-4 border border-gray-400 rounded-lg px-4 ${errors.email ? "border-red-500 ring-2 ring-red-500/20" : "focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20"}  transition-all duration-200`}>
              <MailIcon className="size-5" />
              <input
                type="email"
                name="email"
                id="eamil"
                placeholder="example@gmail.com"
                className="py-2 focus:outline-none w-full"
                onChange={handleInputChange}
                value={email}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* PASSWORD FEILD */}
          <div className="flex flex-col gap-2 group pb-4">
            <label htmlFor="password">Password</label>
            <div className={`relative flex items-center gap-4 border border-gray-400 rounded-lg px-4 ${errors.password ? "border-red-500 ring-2 ring-red-500/20" : "focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20"} transition-all duration-200`}>
              <LockIcon className="size-5" />
              <input
                type={isShowPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="At least 6 characters"
                className="py-2 focus:outline-none w-full"
                onChange={handleInputChange}
                value={password}
              />
              <button type="button" className="absolute right-4 cursor-pointer"
                onClick={() => handleShowPassword("password")}>
                {isShowPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          {/* CONFIRM PASSWORD FEILD */}
          <div className="flex flex-col gap-2 group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={`relative flex items-center gap-4 border border-gray-400 rounded-lg px-4 ${errors.confirmPassword ? "border-red-500 ring-2 ring-red-500/20" : "focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20"} transition-all duration-200`}>
              <LockKeyhole className="size-5" />
              <input
                type={isShowConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="At least 6 characters"
                className="py-2 focus:outline-none w-full"
                onChange={handleInputChange}
                value={confirmPassword}
              />

              <button type="button" className="absolute right-4 cursor-pointer" onClick={() => handleShowPassword("confirm")}>
                {isShowConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
          </div>

          {/* CHECKBOX */}
          <div className="text-xs flex items-start py-2">
            <input type="checkbox" className="mr-2 size-5 cursor-pointer" checked={isChecked} onChange={handleCheck} />
            <p className="text-xs">
              I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span> regarding my document data.
            </p>
          </div>

          {errors.auth && <p className="text-red-500 text-xs pb-4">{errors.auth}</p>}

          {/* SUBMIT BUTTON */}
          <div className="py-4">
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!isChecked || isSigningUp}
            >
              {isSigningUp ?
                <Loader className="size-5 animate-spin" /> :
                <>
                  Create Account
                  <ArrowRight className="size-6" />

                </>
              }
            </button>
          </div>
        </form>
        <div className="flex justify-center pt-2 gap-1.5">
          <p>Already have an account? </p>
          <Link to="/login"><span className="text-blue-600 hover:underline cursor-pointer">{" "}Login</span></Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPageView;