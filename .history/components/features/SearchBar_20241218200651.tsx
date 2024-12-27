import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search-results');
  };

  return (
    <div className="w-full flex items-center justify-center px-4">
      <form onSubmit={handleSearch} className="w-full max-w-3xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
        <Input
          className="w-full pl-11 pr-24 h-12 bg-white border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Senior Full Stack Developer with React expertise"
        />
        <Button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4"
          variant="default"
        >
          Search
        </Button>
      </form>
    </div>
  );
};