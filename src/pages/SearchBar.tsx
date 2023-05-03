import React, { useState, useRef } from "react";

const SearchBar: React.FunctionComponent = () => {
	const [query, setQuery] = useState("");

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // Avoid the refresh on the page when pressing enter or click on search
		console.log(`user current search input: "${query}"`);
	};
	
	const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
		console.log(`user submit input: "${event.target.value}"`);
	};

	const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		console.log(`user focused "${event.target.value}"`);
	};

	return (
		<div className="searchbar">
			<form onSubmit={handleFormSubmit}>
				<div className="">
					<input
						className="rounded-full"
						type="text"
						placeholder="Une destination, demande ..."
						value={query}
						onChange={handleInputChange}
						onFocus={handleFocus}
						/>
				</div>
				<div className="">
					<button type="submit">
						<img className="rounded-full" src="search.png" />
					</button>
				</div>
			</form>
		</div>
	);
};

export default SearchBar;