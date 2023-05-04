import React, { useState } from "react";

interface Autocomplete {
	unique_name: string;
	local_name: string;
}

interface Popular {
	unique_name: string;
	local_name: string;
}

const SearchBar: React.FunctionComponent = () => {
	const [query, setQuery] = useState<string>("");
	const [popular, setPopular] = useState<Popular[]>([]);
	const [autocomplete, setAutocomplete] = useState<Autocomplete[]>([]);
	const [display, setDisplay] = useState<Number>(0); // 0 -> Do not display, 1 -> Display popular, 2 -> Display autocomplete, 3 -> Display popularFrom, 4 -> Display no result
	const [focus, setFocus] = useState<Boolean>(false);

	if (!popular.length) {
		fetch("https://api.comparatrip.eu/cities/popular/5")
		.then(res => res.json())
		.then(data => {
			setPopular(data);
		});
	}
	
	const chooseDisplay = (query : string) => {
		console.log("query.length", query.length);
		console.log("autocomplete.length", autocomplete.length);
		if (query.length < 2)
			setDisplay(1);
		else {
			getAutocomplete(query);
			if (autocomplete.length)
				setDisplay(2);
			else
				setDisplay(4);
		}
	};

	const reset = () => {
		setDisplay(0);
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
		setFocus(true);
		chooseDisplay(event.target.value);
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
					{display === 1 && popular.map(
						(data: Popular) => (
							<li key={data.unique_name}>
								{data.local_name}
							</li>
						)
					)}
					{display === 2 && autocomplete.map(
						(data: Autocomplete) => (
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