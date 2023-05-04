import React, { useState } from "react";
import Image from "next/image";

interface City {
	unique_name: string;
	local_name: string;
	id: number;
}

const SearchBar: React.FunctionComponent = () => {
	const [query, setQuery] = useState<string>("");
	const [popular, setPopular] = useState<City[]>([]);
	const [autocomplete, setAutocomplete] = useState<City[]>([]);
	const [focus, setFocus] = useState<Boolean>(false);
	const [loaded, setLoaded] = useState<Boolean>(false);
	const [submit, setSubmit] = useState<Boolean>(false);
	// The value of display will change depending on the use action
	// 0 -> Do not display, 1 -> Display popular, 2 -> Display autocomplete, 3 -> Display "no result found"
	const [display, setDisplay] = useState<Number>(0);
	

	if (!popular.length) {
		fetch("https://api.comparatrip.eu/cities/popular/5")
		.then(r => r.json())
		.then(r => {
			setPopular(r);
		});
	}

	const fetchAutocomplete = async (str: string) => {
		const data = await (await fetch(`https://api.comparatrip.eu/cities/autocomplete/?q=${str}`)).json();
		if (!data.length)
			setDisplay(3); // User write something that is not in the database, send no result
		else {
			setDisplay(2); // Autocomplete the search of the user
			setAutocomplete(data);
			setLoaded(true);
		}
	};

	function chooseDisplay(query : string) {
		if (query.length < 2) {
			setAutocomplete([]);
			setLoaded(false);
			setDisplay(1); // Make propositions about popular cities
		}
		else {
			fetchAutocomplete(query);
		}
		console.log("query.length", query.length);
		console.log("autocomplete.length", autocomplete.length);
	};

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(event.target)
		setSubmit(true);
		setFocus(false);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
		chooseDisplay(event.target.value);
	};

	const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		setFocus(true);
		chooseDisplay(event.target.value);
	};
	
	const handleUnfocus = () => {
		if (!submit) {
			setQuery("");
			setDisplay(0); // Display nothing
		}
		setAutocomplete([]);
		setFocus(false);
		setLoaded(false);
	}

	function displayDisabled(str: string) {
		return (
			<form className="mt-3" onSubmit={handleFormSubmit}>
				<input
					disabled
					maxLength={50}
					className="rounded-full"
					type="text"
					value={str}
				/>
			</form>
		);
	};

	function displaySearchElem(data: City) {
		return (
			<div className="flex">
				<Image
					alt="city"
					className="px-2"
					width={40}
					height={40}
					src="city.svg"
				/>
				<li>
					{data.local_name}
				</li>
			</div>
		);
	};
	
	function displaySearchForm(dest: Boolean) {
		return (
			<form onSubmit={handleFormSubmit}>
				<input
					maxLength={50}
					className="rounded-full"
					type="text"
					placeholder={dest ? "Une destination, demande ..." : "D'où partons-nous ?"}
					value={query}
					onChange={handleInputChange}
					onFocus={handleFocus}
					onBlur={handleUnfocus}
				/>
				<button className="searchbtn" type="submit">
					<Image
						alt="search"
						width={60}
						height={60}
						className="rounded-full "
						src="search.svg"
					/>
				</button>
			</form>
		);
	};

	return (
		<div className="searchbar m-24">
			{displaySearchForm(!submit)}
			{submit && displayDisabled(query)}
			<ul className="bg-white m-3 rounded-xl">
				{focus &&
					<div className="py-6">
						{(display === 1 || display === 2) && <p className="p-3 text-gray-400">Villes</p>}
						<div className="searchelem">
							{display === 1 && popular.map(
								(data: City) => (
									<div key={data.id} className="p-3">
										{displaySearchElem(data)}
									</div>
								)
							)}
							{display === 2 && loaded && autocomplete.map(
								(data: City) => (
									<div key={data.unique_name} className="p-3">
										{displaySearchElem(data)}
									</div>
								)
							)}
						</div>
						{display === 3 &&
							<div className="flex">
								<Image className="m-6" alt="search" width={30} height={30} src="icons8-search.svg"/>
								<p className="mt-3 text-gray-400">
									Recherche avancée<br />
									<b className="text-black">"{query}"</b>
								</p>
							</div>
						}
					</div>}
				</ul>
			</div>
	);
};


export default SearchBar;