import ProfileLayout from "../components/profile/ProfileLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ProfileViewStudent = () => {
  return (
    <div className="bg-[#f6fefb] flex justify-center items-center min-h-screen">
      <div className="w-[90vw] h-[90vh] max-w-[1732px] bg-[#f2fbf7] rounded-2xl shadow-md flex flex-col lg:flex-row items-center p-8 lg:p-12 gap-10">
        <ProfileLayout>
          {/* Lijevi panel */}
          <div className="w-full max-w-[260px] bg-[#e6f6ef] rounded-2xl p-6 flex flex-col items-center gap-6">
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#8fd0ad] text-sm text-[#0b3b2e] text-center">
              Slika<br />učenika
            </div>
            <p className="text-lg font-semibold text-[#0b3b2e]">
              Ime Prezime
            </p>
          </div>

          {/* Desni sadržaj */}
          <div className="flex-1 w-full">
            <h2 className="mb-6 inline-block rounded-xl bg-[#dff3ea] px-5 py-2 text-lg font-medium">
              Podaci o obrazovanju
            </h2>

            {/* Razina obrazovanja */}
            <div className="mb-6 flex items-center gap-4">
              <label className="min-w-[180px] font-medium">
                Razina obrazovanja:
              </label>
              <Input disabled className="max-w-[240px]" />
            </div>

            {/* Razine znanja */}
            <h3 className="mb-4 font-semibold">Razine znanja:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Matematika
                </label>
                <Input disabled />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Fizika
                </label>
                <Input disabled />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Informatika
                </label>
                <Input disabled />
              </div>
            </div>

            {/* Ciljevi učenja */}
            <h3 className="mb-4 font-semibold">Ciljevi učenja:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Matematika
                </label>
                <Textarea disabled className="min-h-[120px]" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Fizika
                </label>
                <Textarea disabled className="min-h-[120px]" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Informatika
                </label>
                <Textarea disabled className="min-h-[120px]" />
              </div>
            </div>
          </div>
        </ProfileLayout>
      </div>
    </div>
  );
};

export default ProfileViewStudent;
