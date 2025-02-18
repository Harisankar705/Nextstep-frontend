import { useEffect, useMemo, useState, useCallback } from "react";
import { SearchBarProps, Employer, UserCandidate, Candidate, PostType, User } from "../../types/Candidate";
import { debounce } from "lodash";
import { SearchIcon, Loader2, UserCircle, Building2 } from "lucide-react";
import { search } from "../../services/authService";
import { getCompanyLogo, getProfilePictureURL } from "../ImageUtils";
import { SearchResults } from "../../types/Employer";




const INITIAL_RESULTS: SearchResults = {
    users: [],
    employers: [],
    posts: [],
};

const SearchUtil: React.FC<SearchBarProps> = ({
    placeholder = "Search on nextstep",
    className = "",
    onResultSelect,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResults>(INITIAL_RESULTS);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults(INITIAL_RESULTS);
            return;
        }

        setIsSearching(true);
        try {
            const response = await search(query);
            

            if (response?.status === 200 && response?.data?.data) {
                setSearchResults({
                    users: response.data.data.users || [],
                    employers: response.data.data.employers || [],
                    posts: response.data.data.posts || [],
                });
            } else {
                setSearchResults(INITIAL_RESULTS);
            }
        } catch (error) {
            setSearchResults(INITIAL_RESULTS);
        } finally {
            setIsSearching(false);
        }
    };

    const debouncedSearch = useMemo(
        () => debounce(handleSearch, 300),
        []
    );

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
        setShowResults(true);
    }, [debouncedSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const searchContainer = document.getElementById("search-container");
            if (searchContainer && !searchContainer.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const renderUserResult = (user:UserCandidate) => (
        <div
            key={user._id}
        
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
            onClick={() => {
               
                onResultSelect?.({
                    _id: user._id,
                    name: `${user.firstName} ${user.secondName}`,
                    type: 'user'
                });
            }}
        >

            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {user.profilePicture ? (
                    <img
                        src={getProfilePictureURL(user.profilePicture)}
                        alt={`${user.firstName} ${user.secondName}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const parent = target.parentElement;
                            if (parent) {
                                parent.innerHTML = '<div class="text-gray-400"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></div>';
                            }
                        }}
                    />
                ) : (
                    <UserCircle className="w-6 h-6 text-gray-400" />
                )}
            </div>
            <div className="flex-grow min-w-0">
                <div className="font-medium truncate">{`${user.firstName} ${user.secondName}`}</div>
                <div className="text-sm text-gray-500 truncate">{user.email}</div>
            </div>
        </div>
    );

    const renderEmployerResult = (employer: Employer) => (
        <div
            key={employer._id}
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
            onClick={() => onResultSelect?.({ _id: employer._id, name: employer.companyName, type: 'company' })}
        >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {employer.logo ? (
                    <img
                        src={getCompanyLogo(employer.logo)}
                        alt={employer.companyName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-company-logo.png'; 
                            const parent = target.parentElement;
                            if (parent) {
                                parent.innerHTML = '<div class="text-gray-400"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5z"/></svg></div>';
                            }
                        }}
                    />
                ) : (
                    <Building2 className="w-6 h-6 text-gray-400" />
                )}
            </div>
            <div className="flex-grow min-w-0">
                <div className="font-medium truncate">{employer.companyName}</div>
                <div className="text-sm text-gray-500 truncate">{employer.industry}</div>
            </div>
        </div>
    );


    const renderResultSection =<T extends UserCandidate|Employer|PostType> (title: string, items: T[], type: 'users' | 'employers' | 'posts') => {
        if (items.length === 0) return null;

        return (
            <div className="border-t border-gray-100 first:border-0">
                <h3 className="font-semibold text-sm text-gray-600 px-4 py-2">{title}</h3>
                <div className="divide-y divide-gray-100">
                    {items.map((item) => {
                        switch (type) {
                            case 'users':
                                return renderUserResult(item as UserCandidate);
                            case 'employers':
                                return renderEmployerResult(item as Employer);
                            default:
                                return null;
                        }
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={`relative flex items-center ${className}`} id="search-container">
            <SearchIcon className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowResults(true)}
                placeholder={placeholder}
                className="w-full min-w-[240px] pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 rounded-full 
                 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition-all duration-200"
            />
            

            {showResults && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg 
                      border border-gray-200 max-h-[400px] overflow-y-auto z-50">
                    {isSearching ? (
                        <div className="flex items-center justify-center p-4 text-gray-500">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            <span>Searching...</span>
                        </div>
                    ) : (
                        <>
                            {renderResultSection("Users", searchResults.users, 'users')}
                            {renderResultSection("Employers", searchResults.employers, 'employers')}

                            {Object.values(searchResults).every(arr => arr.length === 0) && (
                                <div className="p-4 text-center text-gray-500">
                                    No results found for "{searchQuery}"
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchUtil;