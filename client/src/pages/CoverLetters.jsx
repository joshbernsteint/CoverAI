import Navbar from "../components/Navbar";
import MyFooter from "../components/MyFooter";
import CLCards from "../components/CLCards";
import CLForm from "../components/CLForm";

export default function CoverLetters() {
  return (
    <div className="dark:bg-background_dark">
      <CLForm/>
      <CLCards />
    </div>
  );
}
