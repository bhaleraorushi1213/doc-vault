import { ArrowRight, EyeIcon, EyeOffIcon, FileTextIcon, Loader, LockIcon, MailIcon } from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "../../../store/useAuthStore.js";

const LoginPageView = (props) => {
  const {
    handleSubmit,
    handleInputChange,
    handleShowPassword,
    loginPageState
  } = props;

  const {
    formData,
    isShowPassword,
    errors
  } = loginPageState;

  const { email, password } = formData;
  const { isLoggingIn } = useAuthStore();

  return (
    <div className="flex justify-center items-center md:py-12 bg-[#F8FAFC]">
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
          {errors.auth && (
            <div className="pb-4 bg-red-50 border border-red-500 rounded-lg px-4 py-2">
              <p className="text-red-500 text-xs">{errors.auth}</p> 
            </div>
          )}

          {/* EMAIL FEILD */}
          <div className="flex flex-col gap-2 group pb-4">
            <label htmlFor="email">Email</label>
            <div className={`flex items-center gap-4 border border-gray-400 rounded-lg px-4 ${errors.email ? "border-red-500 ring-2 ring-red-500/20" : "focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20"} transition-all duration-200`}>
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
                onClick={handleShowPassword}>
                {isShowPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="py-4">
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoggingIn}
            >
              {isLoggingIn ?
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
          <p>Don't have an account? </p>
          <Link to="/signup"><span className="text-blue-600 hover:underline cursor-pointer">{" "}Sign up</span></Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPageView;