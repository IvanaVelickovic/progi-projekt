import AuthLayout from "../components/AuthLayout";
import SocialButtons from "../components/SocialButtons";

const Register = () => {
  return (
    <AuthLayout title="Registracija">
      <div className="bg-green-light/50 h-4/5 w-10/12 rounded-2xl shadow-md shadow-gray-300 flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold text-blue-dark">Dobro došli!</h2>
        <p className="text-lg text-blue-dark mb-4">
          Za nastavak, molimo registrirajte se:
        </p>
        <form
          method="POST"
          className="flex flex-col justify-center items-center w-11/12"
        >
          <input
            placeholder="Ime"
            type="text"
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-4"
          ></input>
          <input
            placeholder="Prezime"
            type="text"
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-4"
          ></input>
          <input
            placeholder="E-mail adresa"
            type="text"
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-4"
          ></input>
          <input
            placeholder="Lozinka"
            type="password"
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-4"
          ></input>
          <button
            type="submit"
            className="bg-blue-light text-white text-base p-3 px-7.5 rounded-lg cursor-pointer"
          >
            Registriraj se
          </button>
        </form>
        <SocialButtons authType="register"></SocialButtons>
      </div>
    </AuthLayout>
  );
};

export default Register;

/*   ---ili--- za tailwind
<div className="flex items-center">
  <div className="flex-grow border-t border-gray-400"></div>
  <span className="mx-2 text-gray-500">ili</span>
  <div className="flex-grow border-t border-gray-400"></div>
</div>

*/
