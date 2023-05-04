import React, { useState } from "react";

interface Advise {
	unique_name: string;
	local_name: string;
}

interface Autocomplete {
	unique_name: string;
	local_name: string;
}

const SearchBar: React.FunctionComponent = () => {
	const [query, setQuery] = useState<string>("");
	const [advise, setAdvise] = useState<Advise[]>([]);
	const [autocomplete, setAutocomplete] = useState<Autocomplete[]>([]);
	const [popular, setPopular] = useState<Boolean>(true);
	const [focus, setFocus] = useState<Boolean>(false);

	if (advise === undefined) {
		fetch("https://api.comparatrip.eu/cities/popular/5")
		.then(r => r.json())
		.then(data => {
			setAdvise(data)
		})
	}

	const chooseDisplay = (str : string) => {
		if (str.length > 1) {
			setPopular(false);
		}
		else {
			getAutocomplete(str);
			setPopular(true);
		}
	};

	const reset = () => {
		setPopular(false);
		setFocus(false);
		setQuery("");
		setAutocomplete([]);
	}

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // Avoid the refresh on the page when pressing enter or click on search
		console.log(`user current search input: "${query}"`);
		chooseDisplay(query);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
		chooseDisplay(event.target.value);
		console.log(`user submit input: "${event.target.value}"`);
	};

	const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		chooseDisplay(event.target.value);
		setFocus(true);
		if (query.length < 2)
			setPopular(true);
		console.log(`user focused "${event.target.value}"`);
	};
	
	const getAutocomplete = async (query : string) => {
		const data = await (await fetch(`https://api.comparatrip.eu/cities/autocomplete/?q=${query}`)).json();
		setAutocomplete(data);
		console.log('cities based on the search: ', data);
	};

	return (
		<div className="searchbar m-24">

			<form onSubmit={handleFormSubmit}>
				<input
					className="rounded-full"
					type="text"
					placeholder="Une destination, demande ..."
					value={query}
					onChange={handleInputChange}
					onFocus={handleFocus}
					onBlur={reset}
				/>
					<button type="submit">
						<img className="rounded-full" src="search.png" />
					</button>
			</form>

			<ul className="bg-white m-2 rounded-xl">
				{focus && <div className="p-4">
					{!popular && autocomplete.map(
						(data: Autocomplete) => (
							<li key={data.unique_name}>
								{data.local_name}
							</li>
						)
					)}
					{popular && advise.map(
						(data: Advise) => (
							<li key={data.unique_name}>
								{data.local_name}
							</li>
						)
					)}
				</div>}
			</ul>

		</div>
	);
};

export default SearchBar;