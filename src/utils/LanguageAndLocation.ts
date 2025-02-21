import { LocationSuggestion } from './../types/Candidate';
import axios from "axios";
import { toast } from "react-hot-toast";
interface Country
{
languages?:Record<string,string>
}
export const fetchLanguageSuggestions = async (query: string): Promise<string[]> => {
    if (!query) return [];

    try {
        const response = await axios.get<Country[]>("https://restcountries.com/v3.1/all");
        const languages = response.data
            .flatMap((country) => country.languages ? Object.values(country.languages) : [])
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
        const response = await axios.get<LocationSuggestion[]>(
            `https://api.locationiq.com/v1/autocomplete.php?key=pk.737e7a51608e0777c2ffe0680fb255b1&q=${query}`
        );
        
        return response.data.map((location) => ({
            name: location.display_name??"Unknown location",
            id: location.place_id??0,
        }));
    } catch (error) {
        toast.error("Failed to fetch location suggestions!");
        return [];
    }
};
