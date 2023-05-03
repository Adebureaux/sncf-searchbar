import React, { useState } from "react";

interface SearchBarProps {
	onSearch: (query: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
const [query, setQuery] = useState("");

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	setQuery(event.target.value);
};

const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	event.preventDefault(); // Avoid refreshing the page when submitting the form
	onSearch(query);
};

return (
	<form onSubmit={handleFormSubmit}>
		<div>
			<input
				type="text"
				placeholder="Recherche"
				value={query}
				onChange={handleInputChange}
			/>
		</div>
	</form>
	);
};

export default SearchBar;