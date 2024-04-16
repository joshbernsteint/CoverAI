import SettingForm from "../components/SettingsForm";

export default function SettingsPage() {
  return (
    <>
      <div className="md:px-14 px-4 py-8 min-h-screen w-[100%] max-w-screen m-0 text-center dark:bg-background_dark">
        <h1 className="font-bold text-3xl mt-11"> Settings Page</h1>
        <br />
        <SettingForm></SettingForm>
      </div>
    </>
  );
}
