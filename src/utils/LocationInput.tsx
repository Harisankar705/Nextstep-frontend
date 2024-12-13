import axios from "axios";
import { useRef, useState, useEffect } from "react";

type LocationInputProps = {
    value: string[];
    onChange: (value: string[]) => void;
    error: string | null;
    className?: string;
};
type Country={
    name:{
        common:string
    }
}

const LocationInput: React.FC<LocationInputProps> = ({ value, onChange, error, className }) => {
    const [locationInput, setLocationInput] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.trim();
        setLocationInput(query);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query) {
            debounceRef.current = setTimeout(async () => {
                try {
                    const response = await axios.get<Country[]>("https://restcountries.com/v3.1/all");
                    const locations = response.data
                        .map((country: any) => country.name?.common)
                        .filter((name: string) =>
                            typeof name === "string" && name.toLowerCase().includes(query.toLowerCase())
                        );

                    const uniqueLocations = Array.from(new Set(locations));
                    setLocationSuggestions(uniqueLocations);
                } catch (err) {
                    throw new Error('error occured')
                }
            }, 500);
        } else {
            setLocationSuggestions([]);
        }
    };

    const handleSuggestionClick = (location: string) => {
        if (!value.includes(location)) {
            onChange([...value, location]);
        }
    };

    return (
        <div className={`location-input ${className || ""}`}>
            <input
                type="text"
                value={locationInput}
                onChange={handleLocationChange}
                className="input-field"
                placeholder="Search locations"
            />
            {error && <p className="error-message">{error}</p>}
            <ul className="suggestions-list">
                {locationSuggestions.map((location, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(location)}>
                        {location}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LocationInput;
