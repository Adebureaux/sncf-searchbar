import React, { useState } from "react";

interface Advise {
  unique_name: string;
}

interface Autocomplete {
  unique_name: string;
	local_name: string;
}

const SearchBar: React.FunctionComponent = () => {
	const [query, setQuery] = useState<string>("");
	const [advise, setAdvise] = useState<Advise[]>([]);
	const [autocomplete, setAutocomplete] = useState<Autocomplete[]>([]);

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // Avoid the refresh on the page when pressing enter or click on search
		// console.log(`user current search input: "${query}"`);
		getAutocomplete(query);
	};
	
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
		// console.log(`user submit input: "${event.target.value}"`);
	};

	const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		getPopularCities(5);
		// console.log(`user focused "${event.target.value}"`);
	};

	const getPopularCities = async (n : number) => {
		const data = await (await fetch(`https://api.comparatrip.eu/cities/popular/${n}`)).json();
		setAdvise(data);
		console.log('popular cities proposal : ', data);
	};
	
	const getAutocomplete = async (query : string) => {
		const data = await (await fetch(`https://api.comparatrip.eu/cities/autocomplete/?q=${query}`)).json();
		setAutocomplete(data);
		console.log('cities based on the search: ', data);
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