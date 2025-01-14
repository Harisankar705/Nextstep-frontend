import axios from "axios";
import { toast } from "react-hot-toast";


export const fetchLanguageSuggestions = async (query: string): Promise<string[]> => {
    if (!query) return [];

    try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const languages = response.data
            .flatMap((country: any) => country.languages ? Object.values(country.languages) : [])
            .filter(
                (lang: string) =>
                    typeof lang === "string" &&
                    lang.toLowerCase().includes(query.toLowerCase())
            );

        return Array.from(new Set(languages));
    } catch (error) {
        throw new Error("Error fetching languages:");
        toast.error("Failed to fetch language suggestions!");
        return [];
    }
};


export const fetchLocationSuggestions = async (query: string): Promise<{ name: string; id: number }[]> => {
    if (!query) return [];

    try {
        const response = await axios.get(
            `https://api.locationiq.com/v1/autocomplete.php?key=pk.737e7a51608e0777c2ffe0680fb255b1&q=${query}`
        );
        
        return response.data.map((location: any) => ({
            name: location.display_name,
            id: location.place_id,
        }));
    } catch (error) {
        toast.error("Failed to fetch location suggestions!");
        return [];
    }
};
