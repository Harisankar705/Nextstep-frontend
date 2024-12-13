import axios from "axios";
import { useRef, useState } from "react";

type LanguageInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  error: string | null;
  className?: string;
};

const LanguageInput: React.FC<LanguageInputProps> = ({ value, onChange, error, className }) => {
  const [languageInput, setLanguageInput] = useState("");
  const [languageSuggestions, setLanguageSuggestions] = useState<string[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleLanguageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim();
    setLanguageInput(query);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query) {
      debounceRef.current = setTimeout(async () => {
        try {
          const response = await axios.get("https://restcountries.com/v3.1/all");
          const languages = response.data
            .flatMap((country: any) => (country.languages ? Object.values(country.languages) : []))
            .filter((lang: string) => {
              return typeof lang === "string" && lang.toLowerCase().includes(query.toLowerCase());
            });

          const uniqueLanguages: string[] = Array.from(new Set(languages));
          setLanguageSuggestions(uniqueLanguages);
        } catch (error) {
          throw new Error("Error occurred during fetching languages");
        }
      }, 500);
    } else {
      setLanguageSuggestions([]);
    }
  };

  return (
    <div className={`language-input ${className}`}>
      <input
        type="text"
        value={languageInput}
        onChange={handleLanguageChange}
        className="input-field"
        placeholder="Search languages"
      />
      {error && <p className="error-message">{error}</p>}
      <ul className="suggestions-list">
        {languageSuggestions.map((language, index) => (
          <li
            key={index}
            onClick={() => {
              onChange([...value, language]);
              setLanguageInput("");
              setLanguageSuggestions([]); 
            }}
          >
            {language}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageInput;
