import CLCards from "../components/CLCards";
import CLForm from "../components/CLForm";
import { useState } from "react";
// import { useSettings } from '../context/SettingsContext'; // Import useSettings hook


export default function CoverLetters() {
  // const { settings, setSettings } = useSettings(); // Access user settings from context
  // console.log(settings)
  const [addedCoverLetter, setAddedCoverLetter] = useState(null);

  return (
    <div className="min-h-screen dark:bg-background_dark">
      <CLForm addedCoverLetter={addedCoverLetter} setAddedCoverLetter={setAddedCoverLetter} />
      <CLCards addedCoverLetter={addedCoverLetter} setAddedCoverLetter={setAddedCoverLetter} />
    </div>
  );
}
