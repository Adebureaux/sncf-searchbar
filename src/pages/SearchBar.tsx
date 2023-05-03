import React, { useState, useRef } from "react";

const SearchBar: React.FunctionComponent = () => {
	const [query, setQuery] = useState("");

	const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
		console.log(`user submit input: "${event.target.value}"`);
	};

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // Avoid the refresh on the page when submitting the form
		console.log(`user submit input: "${query}"`);
	};

	return (
		<form onSubmit={handleFormSubmit}>
			<div>
				<input
					type="text"
					placeholder="Une destination, demande ..."
					value={query}
					onChange={handleInputChange}
				/>
			</div>
		</form>
		);
};

export default SearchBar;