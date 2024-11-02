import React, { useState, useEffect } from "react";

const jokes = [
  "Why do engineers mix up Christmas and Halloween? Because Oct 31 == Dec 25.",
  "Why did the software engineer go broke? Because he used up all his cache.",
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "How do you comfort a JavaScript bug? You console it.",
  "Why did the developer go broke? Because he couldn't 'cache' his checks.",
  "Why did the engineer cross the road? To optimize the process!",
  "How many programmers does it take to change a light bulb? None. It’s a hardware problem.",
  "Why don't programmers like nature? It has too many bugs.",
  "Why did the Java developer wear glasses? Because he couldn’t C#.",
  "What do you call 8 hobbits? A hobbyte.",
];

const Loader = () => {
  const [joke, setJoke] = useState("");

  useEffect(() => {
    const changeJoke = () => {
      const randomIndex = Math.floor(Math.random() * jokes.length);
      setJoke(jokes[randomIndex]);
    };

    // Change joke every 2 seconds
    const intervalId = setInterval(changeJoke, 2000);

    // Set the initial joke
    changeJoke();

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="h-24 w-24 border-t-4 border-b-4 border-[#D4AF37] rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 h-24 w-24 border-t-4 border-b-4 border-[#FFD700] rounded-full animate-spin"></div>
      </div>
      <p className="text-center text-gray-700 font-medium text-lg mt-4">
        {joke}
      </p>
    </div>
  );
};

export default Loader;
