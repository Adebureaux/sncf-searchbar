import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import city from "/public/icons/city.svg"
import reset from "/public/icons/reset.svg"
import search from "/public/icons/search.svg"
import searchsim from "/public/icons/searchsim.svg"

interface City {
	unique_name: string;
	local_name: string;
	id: number;
}

const SearchBar: React.FunctionComponent = () => {
	const content = useRef<HTMLDivElement>(null);
	const [query, setQuery] = useState<string>("");
	const [destQuery, setDestQuery] = useState<string>("");
	const [popular, setPopular] = useState<City[]>([]);
	const [autocomplete, setAutocomplete] = useState<City[]>([]);
	const [focus, setFocus] = useState<boolean>(false);
	const [submit, setSubmit] = useState<boolean>(false);
	const [loaded, setLoaded] = useState<boolean>(false);
	const [display, setDisplay] = useState<number>(0);

	const resetFocus = (blur: boolean) => {
		setAutocomplete([]);
		setDisplay(0);
		setFocus(false);
		if (blur)
			(document.activeElement as HTMLInputElement)?.blur();
	};

	// Hook to fetch popular cities by default when the component is loaded
	useEffect(() => {
		fetchPopular("https://api.comparatrip.eu/cities/popular/5");
	}, []);

	// Hook to handle unfocus
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

	// Fetching popular cities based either on destination 'destQuery', or the 5 more popular cities
	const fetchPopular = async (target: string) => {
			await fetch(target)
			.then(r => r.json())
			.catch(e => console.error(e))
			.then(r => {
				setPopular(r);
			})
			.catch(e => console.error(e));
	};

	// Fetching autocomplete results based on the user input
	const fetchAutocomplete = async (set: Function, target: string) => {
		await fetch(target)
		.then(r => r.json())
		.catch(e => console.error(e))
		.then(r => {
			if (!r.length)	// User write something that is not in the database, send no result
			setDisplay(3);
			else 						// Suggest autocomplete
				setDisplay(2); 
				set(r);
				setLoaded(true);
		})
		.catch(e => console.error(e));
	};

	// Setup display
	// The value of 'display' will change depending on the user action
	// 0 -> Do not display
	// 1 -> Display popular
	// 2 -> Display autocomplete
	// 3 -> Display no result found
	const chooseDisplay = (str : string) => {
		if (str.length < 2) {
			setAutocomplete([]);
			setLoaded(false);
			setDisplay(1); // Make propositions about popular cities based on the API results
		}
		else
			fetchAutocomplete(setAutocomplete, `https://api.comparatrip.eu/cities/autocomplete/?q=${query}`);
		console.log("query.length", str.length);
		console.log("autocomplete.length", autocomplete.length);
	};

	// Handle behavior of pressing enter when input and of clicking the magnifying glass
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

	// Display each element with this pattern
	function displaySearchElem(data: City) {
		return (
			<div className="py-2 flex cursor-pointer" onClick={e => handleClickCity(e, data)}>
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
	
	// Display the searchbar either for a destination or for a departure
	function displaySearchForm() {
		return (
			<form onSubmit={!submit ? handleFormEvent : undefined}>
				<input
					className="rounded-full"
					type="text"
					placeholder={!submit ? "Une destination, demande ..." : "D'où partons-nous ?"}
					value={query}
					onChange={handleInputChange}
					onFocus={handleFocus}
				/>
				<button className="searchbtn" type="submit">
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

	// Display the disabled searchbar and add a reset button
	function displayDisabledSearchForm() {
		return (
			<form className="mt-3">
				<input
					disabled
					className="rounded-full"
					type="text"
					value={destQuery}
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
						{(display === 1 || display === 2) && <p className="p-3 text-gray-400">Villes</p>}
						<div className="searchelem">
							{/* Case suggest : display popular cities */}
							{display === 1 && popular.map(
								(data: City) => (
									<div key={data.id} className="p-3">
										{displaySearchElem(data)}
									</div>
								)
							)}
							{/* Case autocomplete : display autocomplete based on the match between query user input and the API results */}
							{display === 2 && loaded && autocomplete.map(
								(data: City, id: number) => (
									<div key={id} className="p-3 cyautocomplete">
										{displaySearchElem(data)}
									</div>
								)
							)}
						</div>
						{/* Error case: the input does not match any API result */}
						{display === 3 &&
							<div className="flex">
								<Image className="m-6" alt="search" width={30} height={30} src={searchsim}/>
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
