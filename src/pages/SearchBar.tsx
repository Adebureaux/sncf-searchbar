import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import city from "/public/icons/city.svg"
import reset from "/public/icons/reset.svg"
import search from "/public/icons/search.svg"
import searchmg from "/public/icons/searchmg.svg"

interface City {
	unique_name: string;
	local_name: string;
	id: number;
}

const SearchBar: React.FunctionComponent = () => {
	const [query, setQuery] = useState<string>("");
	const [destQuery, setDestQuery] = useState<string>("");
	const [popular, setPopular] = useState<City[]>([]);
	const [autocomplete, setAutocomplete] = useState<City[]>([]);
	const [focus, setFocus] = useState<boolean>(false);
	const [submit, setSubmit] = useState<boolean>(false);
	const [loaded, setLoaded] = useState<boolean>(false);
	const content = useRef<HTMLDivElement>(null);
	
	// The 'display' state variable will be updated based on user actions. The possible values for 'display' are:
	// 0: Do not display anything.
	// 1: Display popular results.
	// 2: Display autocomplete suggestions.
	// 3: Display a message indicating that no results were found.
	const [display, setDisplay] = useState<number>(0);

	const resetFocus = (blur: boolean) => {
		setAutocomplete([]);
		setDisplay(0);
		setFocus(false);
		if (blur)
			(document.activeElement as HTMLInputElement)?.blur();
	};

	// This hook is designed to automatically retrieve a list of popular cities when the component is initially loaded.
	useEffect(() => {
		fetchPopular("https://api.comparatrip.eu/cities/popular/5");
	}, []);

	// Hook that is used to handle the unfocus event. 
	useEffect(() => {
		const handleUnfocus = (event: MouseEvent) => {
			if (!content.current?.contains(event.target as Node)) {
				resetFocus(false)
				setLoaded(false);
			}
		};
		document.addEventListener("click", handleUnfocus);
		return () => {document.removeEventListener("click", handleUnfocus);};
	}, []);

	// Fetch the list of popular cities based on either the user's destination search query, or a predefined list of the five most popular cities.
	const fetchPopular = async (target: string) => {
		await fetch(target)
		.then(r => r.json())
		.catch(e => console.error(e))
		.then(r => {
			if (r?.length)
				setPopular(r);
		})
		.catch(e => console.error(e));
	};

	// The system retrieves autocomplete suggestions by analyzing the user's input.
	const fetchAutocomplete = async (set: Function, target: string) => {
		await fetch(target)
		.then(r => r.json())
		.catch(e => console.error(e))
		.then(r => {
			if (r?.length) {
				setDisplay(2);					// If the user inputs a query that does not exist in the database, the system will return no results.
				set(r);
				setLoaded(true);
			}	
			else 					
				setDisplay(3);					// Suggest autocomplete results.
		})
		.catch(e => console.error(e));
	};

	const chooseDisplay = (str : string) => {
		setLoaded(false);
		if (str.length < 2) {
			setAutocomplete([]);
			setDisplay(1); 						// Make suggestions about popular cities based on the API results.
		}
		else
			fetchAutocomplete(setAutocomplete, `https://api.comparatrip.eu/cities/autocomplete/?q=${query}`);
		console.log("query.length", str.length);
		console.log("autocomplete.length", autocomplete.length);
	};

	// Handling of user input behavior when either the Enter key is pressed or the search button is clicked.
	const handleSubmit = (destination: string, fullDestination: string) => {
		if (fullDestination.length)
			setDestQuery(fullDestination);
		else
			setDestQuery(destination);
		fetchPopular(`https://api.comparatrip.eu/cities/popular/from/${destination}/5`);
		if (!submit)
			setQuery("");
		resetFocus(true);
		setSubmit(true);
	};

	const handleFormEvent = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		handleSubmit(query, "");
		chooseDisplay(query);
	};

	const handleClickCity = (event: React.MouseEvent<HTMLDivElement>, city : City) => {
		if (!submit)
			handleSubmit(city.unique_name, city.local_name);
		else {
			resetFocus(true);
			setQuery(city.local_name);
		}
		chooseDisplay(query);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
		chooseDisplay(event.target.value);
	};

	const handleFocus = async (event: React.FocusEvent<HTMLInputElement>) => {
		setFocus(true);
		chooseDisplay(event.target.value);
	};

	// Display the pattern for each found element.
	function displaySearchElem(data: City) {
		return (
			<div className="py-2 flex">
				<Image
					alt="city"
					className="px-2"
					width={40}
					height={40}
					src={city}
				/>
				<li>
					{data.local_name}
				</li>
			</div>
		);
	};
	
	// Display the search bar pattern for either a departure or a destination search.
	function displaySearchForm() {
		return (
			<form onSubmit={!submit ? handleFormEvent : undefined} data-testid="form-submit">
				<input
					className="rounded-full"
					type="text"
					placeholder={!submit ? "Une destination, demande ..." : "D'où partons-nous ?"}
					value={query}
					onChange={handleInputChange}
					onFocus={handleFocus}
					data-testid="search-input"
				/>
				<button className="searchbtn" type="submit" data-testid="search-btn">
					<Image
						alt="search"
						width={60}
						height={60}
						className="rounded-full "
						src={search}
					/>
				</button>
			</form>
		);
	};

	// Display the search bar in a disabled state and include a reset button.
	function displayDisabledSearchForm() {
		return (
			<form className="mt-3">
				<input
					disabled
					className="rounded-full"
					type="text"
					value={destQuery}
					data-testid="disabled-input"
				/>
				<button className="searchbtn" type="submit">
					<Image
						alt="reset"
						width={60}
						height={60}
						className="rounded-full "
						src={reset}
					/>
				</button>
			</form>
		);
	};

	return (
		<div className="container mx-auto">
			{focus && <div className="focus"></div>}
			<div className="searchbar mt-20" ref={content}>
				{displaySearchForm()}
				{submit && displayDisabledSearchForm()}
				<ul className="bg-white m-3 rounded-xl overflow-auto">
				{focus &&
					<div className="py-6">
						{(display === 1 || display === 2) && 
							<p className="p-3 text-gray-400">Villes</p>}
							<div className="searchelem">
							{/* Case suggestion: Display a collection of popular destinations */}
								{display === 1 && popular?.map(
									(data: City) => (
										<div
											key={data.id}
											className="p-3 cursor-pointer"
											onClick={e => handleClickCity(e, data)}
											data-testid="popular-cities">
											{displaySearchElem(data)}
										</div>
									)
								)}
								{/* Case autocomplete: Show autocomplete suggestions based on the user's input and the results obtained from the API. */}
								{display === 2 && loaded && autocomplete?.map(
									(data: City, id: number) => (
										<div
											key={id}
											className="p-3 cursor-pointer"
											onClick={e => handleClickCity(e, data)}
											data-testid="autocomplete-results">
											{displaySearchElem(data)}
										</div>
									)
								)}
						</div>
						{/* Error case: When there are no API results that match the user's input, indicate an error has occurred. */}
						{display === 3 &&
							<div className="flex" data-testid="no-results">
								<Image
									className="m-6"
									alt="search"
									width={30}
									height={30}
									src={searchmg}
								/>
								<p className="mt-3 text-gray-400">
									Recherche avancée<br />
									<b className="text-black flex-nowrap">&quot;{query}&quot;</b>
								</p>
							</div>
						}
					</div>
				}
				</ul>
			</div>
			<Image alt="bat" className="batbat" width={50} height={50} src="/batbat.png" />
		</div>
	);
};


export default SearchBar;
