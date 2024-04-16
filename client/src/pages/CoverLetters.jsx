import Navbar from "../components/Navbar";
import MyFooter from "../components/MyFooter";
import CLCards from "../components/CLCards";
import CLForm from "../components/CLForm";
// import { useSettings } from '../context/SettingsContext'; // Import useSettings hook


export default function CoverLetters() {
  // const { settings, setSettings } = useSettings(); // Access user settings from context
  // console.log(settings)
  return (
    <>
      <CLForm/>
      <CLCards />
    </>
  );
}
