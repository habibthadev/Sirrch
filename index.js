var toggleBtn = document.querySelector(
	"header .toggle"
);
var searchText = document.querySelector(
	".search input"
);
var searchBtn = document.querySelector(
	".search button"
);
var searchResult =
	document.querySelector(
		".search-result"
	);
var searchHead = document.querySelector(
	".search-head"
);
var searchMeanings =
	document.querySelector(
		".search-meanings"
	);
var sources =
	document.querySelector(".source");
var notFound = document.querySelector(
	".not-found"
);
var loader =
	document.querySelector(".loader");
var audio =
	document.querySelector("#audio");

const toggleInterface = () => {
	const toggleBall =
		toggleBtn.querySelector(".ball");
	toggleBall.classList.toggle("dark");
	document.body.classList.toggle(
		"dark"
	);
};
const fetchData = async () => {
	loader.style.display = "flex";
	searchResult.style.display = "none";
	notFound.style.display = "none";
	try {
		const res = await fetch(
			`https://api.dictionaryapi.dev/api/v2/entries/en/${searchText.value}`
		);
		const data = await res.json();
		searchWord(data[0]);
		if (data) {
			loader.style.display = "none";
		}
	} catch (err) {
		searchWord(err.message);
	}
};

const searchWord = data => {
	if (data == undefined) {
		notFound.style.display = "flex";
		searchResult.style.display = "none";
		notFound.textContent = "Not Found";
	} else {
		notFound.style.display = "none";
		searchResult.style.display =
			"block";

		searchHead.innerHTML = `
			<div>
				<strong>${data?.word}</strong>
				${
					data?.phonetic == undefined
						? ""
						: `<p>${data?.phonetic}</p>`
				}
			</div>
			<button class="fa fa-play" id="play"></button>
	`;

		document
			.querySelector("#play")
			.addEventListener("click", () => {
				data?.phonetics?.forEach(
					phone => {
						if (phone.audio.trim() == "" || phone.audio == undefined) {
							alert("No Sound")
						}
						else {
							audio.src = phone.audio;
						console.log(phone.audio);
						audio.play();
					}}
				);
			});

		data?.meanings?.forEach(meaning => {
			const eachMeaning =
				document.createElement(
					"section"
				);
			eachMeaning.innerHTML = `
		<div class="search-subhead">
			<strong>${meaning?.partOfSpeech} <hr /> </strong>
			<em>Meaning</em>
		</div>
		`;

			meaning?.definitions?.forEach(
				def => {
					const definition =
						document.createElement(
							"ul"
						);
					definition.innerHTML = `<li>${def?.definition}
					 </li>
					 `;
					eachMeaning.appendChild(
						definition
					);
				}
			);

			const synoText =
				document.createElement(
					"strong"
				);
			synoText.classList.add(
				"synonyms-text"
			);
			synoText.textContent =
				"Synonyms:";
			eachMeaning.appendChild(synoText);

			meaning?.synonyms?.forEach(
				syn => {
					const synonyms =
						document.createElement(
							"div"
						);
					synonyms.classList.add(
						"synonyms"
					);
					if (syn.length > 0) {
						synonyms.textContent = syn;
					} else {
						synonyms.textContent =
							"none";
					}
					eachMeaning.appendChild(
						synonyms
					);
				}
			);
			searchMeanings.appendChild(
				eachMeaning
			);
		});

		const srcText =
			document.createElement("strong");
		srcText.textContent = "Source: ";
		sources.appendChild(srcText);

		data?.sourceUrls?.forEach(
			source => {
				const src =
					document.createElement("a");
				src.href = source;
				src.textContent = `${source}`;
				sources.appendChild(src);
			}
		);
	}
	console.log(data);
};

toggleBtn.addEventListener(
	"click",
	toggleInterface
);

searchBtn.addEventListener(
	"click",
	fetchData
);
