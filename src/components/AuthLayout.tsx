interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-[#F8FFFC] h-[80vh] w-2/3 min-w-4xl rounded-2xl flex justify-between shadow-md shadow-gray-300 overflow-hidden">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-semibold text-blue-dark">{title}</h1>
          <img
            src="/images/desktop_login.png"
            className="object-contain max-h-[400px]"
          ></img>
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
