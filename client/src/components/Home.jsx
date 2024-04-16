import { useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import Letter from "../components/canvas/Letter";
import axios from "axios";
import { Context } from "../App";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const [isDarkMode, setIsDarkMode] = useContext(Context);
  const { isLoaded, getToken } = useAuth();

  useEffect(() => {
    const fetchThemeSettings = async () => {
      const token = await getToken();
      if (isLoaded === true && !token) return;
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/users/settings",
          {
            headers: { ...headers, "Content-Type": "application/json" },
          }
        );

        setIsDarkMode(response.data.settings.dark_mode);
      } catch (error) {
        // console.error("Error occurred while fetching theme settings:", error);
        toast.error("Server error occurred while fetching theme settings.");
      }
    }
    fetchThemeSettings();
    // eslint-disable-next-line
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-white dark:bg-background_dark">
      <div
        className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}
      >
        <div>
          <h1 className={`text-[60px] text-black dark:text-white`}>
            Crafting <br /> Success,
            <br />
          </h1>
        </div>
      </div>
      <div className="absolute bottom-[120px] right-10 pr-10 pb-10">
        <span className="text-black font-semibold text-[60px] dark:text-white">
          One Letter <br /> at a Time
        </span>
      </div>
      <Letter />

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-10">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary  flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Home;
