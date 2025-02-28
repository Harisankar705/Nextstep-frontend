import React from "react";
import { SearchResultsDropdown } from "../../types/Candidate";
import Spinner from "../Spinner";
import { SearchResultItem } from "./SearchResultItem";
export const SearchResultsDropDown: React.FC<SearchResultsDropdown> = ({
  results,
  isSearching,
  onSelect,
}) => {
  return (
    <div className="absoulte top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50 sm:max-h-72 md:max-h-80 lg:max-h-96">
      {isSearching ? (
        <div className="p-4 text-center text-gray-500">
          <Spinner loading={true} />
          Searching....
        </div>
      ) : (
        <div className="py-2">
          {results.map((result) => (
            <SearchResultItem
              key={result._id}
              result={result}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
