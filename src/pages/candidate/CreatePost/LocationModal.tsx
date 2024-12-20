import { X } from "lucide-react";
import { LocationModalProps } from "../../../types/Candidate";
import Spinner from "../../../utils/Spinner";

export const LocationModal:React.FC<LocationModalProps>=({
    isOpen,
    onClose,
    locationState,
    searchLocation,
    onLocationSelect,
    onSearchChange,
    onRetry
})=>{
    if(!isOpen)return null
    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        Search for location
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter your location"
                            className="w-full p-2 border rounded-lg mb-4"
                            value={searchLocation}

                            onChange={onSearchChange}


                        />
                        {locationState.isLoading && (
                            <div className="absolute right-3 top-2.5">
                                <Spinner loading={true} />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {locationState.error ? (
                            <div className="text-center py-4">
                                <p className="text-red-500 mb-2">{locationState.error}</p>
                                <button onClick={onRetry}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Try again</button>
                            </div>


                        ) : locationState.results.length > 0 ? (
                            locationState.results.map((location) => (
                                <button
                                    key={location.id}
                                    onClick={()=>onLocationSelect(location.name)}
                                    className="w-full text-left p-2 hover:bg-gray=100 rounded-lg"
                                >
                                    <div className="font-medium">
                                        {location.name}
                                    </div>
                                </button>
                            ))
                        ) : searchLocation.trim() && !locationState.isLoading ? (
                            <div className="text-center py-4 text-gray-500">
                                No locations found
                            </div>
                        ) : null}


                    </div>
                </div>
            </div>
        </div>
    )
}