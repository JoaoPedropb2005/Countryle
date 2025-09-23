let countries = [];
let targetCountry;
let attempts = 6;
let guessedCountries = [];

async function loadCountries() {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,region,population,latlng,translations");
    const data = await res.json();
    countries = data.map(c => {
        const countryName = c.translations?.por?.common || c.name.common;
        return {
            name: countryName,
            continent: c.region,
            population: c.population,
            latlng: c.latlng
        };
    });
    pickRandomCountry();
    populateDatalist();
}

function populateDatalist() {
    const datalist = document.getElementById("countriesList");
    countries.forEach(country => {
        const option = document.createElement("option");
        option.value = country.name;
        datalist.appendChild(option);
    });
}

function pickRandomCountry() {
    targetCountry = countries[Math.floor(Math.random() * countries.length)];
    console.log("País sorteado:", targetCountry.name);
}

function haversineDistance(coords1, coords2) {
    const toRad = (x) => x * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(coords2[0] - coords1[0]);
    const dLon = toRad(coords2[1] - coords1[1]);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(coords1[0])) * Math.cos(toRad(coords2[0])) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function checkGuess() {
    const guessInput = document.getElementById("guessInput");
    const guess = guessInput.value.trim();
    const feedbackHistoryDiv = document.getElementById("feedback-history");
    const attemptsLeftDiv = document.getElementById("attemptsLeft");
    const resultDiv = document.getElementById("result");
    const messageArea = document.getElementById("messageArea");

    messageArea.textContent = "";

    if (!guess) {
        messageArea.textContent = "Por favor, digite o nome de um país.";
        return;
    }

    const guessedCountry = countries.find(c => c.name.toLowerCase() === guess.toLowerCase());
    if (!guessedCountry) {
        messageArea.textContent = "País não encontrado. Tente novamente.";
        return;
    }

    if (guessedCountries.includes(guessedCountry.name)) {
        messageArea.textContent = "Você já chutou este país. Tente outro.";
        return;
    }
    
    guessedCountries.push(guessedCountry.name);

    guessInput.value = "";

    const feedbackHtml = generateFeedback(guessedCountry, targetCountry);
    const newFeedbackRow = document.createElement("div");
    newFeedbackRow.className = "feedback-row";
    newFeedbackRow.innerHTML = `<span>${guessedCountry.name}:</span>` + feedbackHtml;
    feedbackHistoryDiv.prepend(newFeedbackRow);

    if (guessedCountry.name.toLowerCase() === targetCountry.name.toLowerCase()) {
        resultDiv.innerHTML = `<h2>🎉 Você acertou! O país era ${targetCountry.name}!</h2>`;
        guessInput.disabled = true;
        document.getElementById("guessBtn").disabled = true;
        return;
    }

    attempts--;
    attemptsLeftDiv.textContent = `Tentativas restantes: ${attempts}`;

    if (attempts <= 0) {
        const correctCountryFeedbackHtml = generateFeedback(targetCountry, targetCountry);
        resultDiv.innerHTML = `<h2>❌ Fim de jogo! O país era ${targetCountry.name}.</h2>`;
        const correctCountryRow = document.createElement("div");
        correctCountryRow.className = "feedback-row";
        correctCountryRow.innerHTML = `<span>${targetCountry.name}:</span>` + correctCountryFeedbackHtml;
        resultDiv.appendChild(correctCountryRow);
        
        guessInput.disabled = true;
        document.getElementById("guessBtn").disabled = true;
    }
}

function generateFeedback(guess, target) {
    const feedbackItems = [];

    const hemisGuess = guess.latlng[0] >= 0 ? "Norte" : "Sul";
    const hemisTarget = target.latlng[0] >= 0 ? "Norte" : "Sul";
    const hemisCorrect = hemisGuess === hemisTarget;
    const hemisContent = hemisCorrect ? hemisGuess : `${hemisGuess} ${guess.latlng[0] < target.latlng[0] ? '▲' : '▼'}`;
    feedbackItems.push({ label: "Hemisfério", correct: hemisCorrect, content: hemisContent });

    const continentCorrect = guess.continent === target.continent;
    feedbackItems.push({ label: "Continente", correct: continentCorrect, content: guess.continent });

    let popStatus;
    const popDiff = Math.abs(guess.population - target.population);
    if (popDiff <= target.population * 0.20) {
        popStatus = "green";
    } else if (popDiff <= target.population * 0.40) {
        popStatus = "yellow";
    } else {
        popStatus = "red";
    }

    let popContent = '';
    const popArrow = guess.population > target.population ? '▼ Menor' : '▲ Maior';
    if (popStatus === "green" || popStatus === "yellow") {
        popContent = `${(guess.population / 1000000).toFixed(1)}M`;
    } else {
        popContent = popArrow;
    }
    feedbackItems.push({ label: "População", status: popStatus, content: popContent });

    const distance = haversineDistance(guess.latlng, target.latlng);
    const coordCorrect = distance < 100;
    let coordContent = '';
    if (coordCorrect) {
        coordContent = `${Math.round(distance)}km`;
    } else {
        const latDiff = target.latlng[0] - guess.latlng[0];
        const lonDiff = target.latlng[1] - guess.latlng[1];
        
        let coordArrow = '';
        if (latDiff > 0 && lonDiff > 0) {
            coordArrow = '↗';
        } else if (latDiff > 0 && lonDiff < 0) {
            coordArrow = '↖';
        } else if (latDiff < 0 && lonDiff > 0) {
            coordArrow = '↘';
        } else if (latDiff < 0 && lonDiff < 0) {
            coordArrow = '↙';
        } else if (latDiff > 0) {
            coordArrow = '↑';
        } else if (latDiff < 0) {
            coordArrow = '↓';
        } else if (lonDiff > 0) {
            coordArrow = '→';
        } else if (lonDiff < 0) {
            coordArrow = '←';
        }
        coordContent = `${Math.round(distance)}km ${coordArrow}`;
    }
    feedbackItems.push({ label: "Coordenadas", correct: coordCorrect, content: coordContent });

    return feedbackItems.map(item => `
        <div class="feedback-item">
            <div class="dot ${item.status || (item.correct ? "green" : "red")}">
                ${item.content}
            </div>
            <span>${item.label}</span>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("guessBtn").addEventListener("click", checkGuess);
    document.getElementById("guessInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            checkGuess();
        }
    });
    loadCountries();
});