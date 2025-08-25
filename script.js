class ELOSimulator {
    constructor() {
        this.teams = this.initializeTeams();
        this.selectedTeams = [];
        this.tournament = null;
        this.kFactor = 32;
        this.simulationStats = {
            team1Wins: 0,
            team2Wins: 0,
            draws: 0,
            totalGames: 0
        };

        this.initializeEventListeners();
        this.populateTeamsGrid();
    }

    initializeTeams() {
        return [
            { id: 'germany', name: 'Deutschland', elo: 1950, country: 'Deutschland' },
            { id: 'france', name: 'Frankreich', elo: 2000, country: 'Frankreich' },
            { id: 'spain', name: 'Spanien', elo: 1980, country: 'Spanien' },
            { id: 'england', name: 'England', elo: 1970, country: 'England' },
            { id: 'italy', name: 'Italien', elo: 1960, country: 'Italien' },
            { id: 'portugal', name: 'Portugal', elo: 1940, country: 'Portugal' },
            { id: 'netherlands', name: 'Niederlande', elo: 1930, country: 'Niederlande' },
            { id: 'belgium', name: 'Belgien', elo: 1920, country: 'Belgien' },
            { id: 'croatia', name: 'Kroatien', elo: 1910, country: 'Kroatien' },
            { id: 'switzerland', name: 'Schweiz', elo: 1900, country: 'Schweiz' },
            { id: 'poland', name: 'Polen', elo: 1890, country: 'Polen' },
            { id: 'denmark', name: 'Dänemark', elo: 1880, country: 'Dänemark' },
            { id: 'sweden', name: 'Schweden', elo: 1870, country: 'Schweden' },
            { id: 'austria', name: 'Österreich', elo: 1860, country: 'Österreich' },
            { id: 'ukraine', name: 'Ukraine', elo: 1850, country: 'Ukraine' },
            { id: 'scotland', name: 'Schottland', elo: 1840, country: 'Schottland' },
            { id: 'wales', name: 'Wales', elo: 1830, country: 'Wales' },
            { id: 'turkey', name: 'Türkei', elo: 1820, country: 'Türkei' },
            { id: 'czech', name: 'Tschechien', elo: 1810, country: 'Tschechien' },
            { id: 'hungary', name: 'Ungarn', elo: 1800, country: 'Ungarn' },
            { id: 'romania', name: 'Rumänien', elo: 1790, country: 'Rumänien' },
            { id: 'bulgaria', name: 'Bulgarien', elo: 1780, country: 'Bulgarien' },
            { id: 'serbia', name: 'Serbien', elo: 1770, country: 'Serbien' },
            { id: 'slovakia', name: 'Slowakei', elo: 1760, country: 'Slowakei' },
            { id: 'slovenia', name: 'Slowenien', elo: 1750, country: 'Slowenien' }
        ];
    }

    initializeEventListeners() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectPresetTeam(e.target.dataset.team));
        });

        document.getElementById('simulate-match').addEventListener('click', () => this.simulateMatch());

        document.getElementById('create-tournament').addEventListener('click', () => this.createTournament());
        document.getElementById('simulate-tournament').addEventListener('click', () => this.simulateTournament());

        document.getElementById('group-count').addEventListener('change', () => this.updateTournamentStructure());
        document.getElementById('teams-per-group').addEventListener('change', () => this.updateTournamentStructure());

        document.querySelectorAll('input[name="tournament-type"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const groupSettings = document.querySelector('.group-settings');
                if (document.querySelector('input[name="tournament-type"]:checked').value === 'groups') {
                    groupSettings.classList.remove('hidden');
                } else {
                    groupSettings.classList.add('hidden');
                }
                this.updateTournamentStructure();
            });
        });
        document.querySelector('.group-settings').classList.remove('hidden');
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const targetTab = document.getElementById(tabName);
        const targetButton = document.querySelector(`[data-tab="${tabName}"]`);

        if (!targetTab || !targetButton) {
            return;
        }

        targetTab.classList.add('active');
        targetButton.classList.add('active');

        if (tabName === 'tournament') {
            const tournamentTeamGrid = document.getElementById('team-grid');
            if (tournamentTeamGrid) {
                this.ensureManualTeamInput();
                tournamentTeamGrid.style.display = 'grid';
            }
        }
    }

    ensureManualTeamInput() {
        const tournamentTeamGrid = document.getElementById('team-grid');
        if (!tournamentTeamGrid) return;

        if (tournamentTeamGrid.querySelector('.manual-team-input')) {
            return;
        }
        this.addManualTeamInput();
    }

    addManualTeamInput() {
        const tournamentTeamGrid = document.getElementById('team-grid');
        if (!tournamentTeamGrid) {
            return;
        }

        const manualInputSection = document.createElement('div');
        manualInputSection.className = 'manual-team-input';
        manualInputSection.innerHTML = `
            <h3>🏆 Manuell Team hinzufügen</h3>
            <div class="input-group">
                <input type="text" id="manual-team-name" placeholder="Team Name">
                <input type="number" id="manual-team-elo" placeholder="ELO Rating">
                <button id="add-manual-team">➕ Team hinzufügen</button>
            </div>
            <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem; text-align: center;">
                Hinzugefügte Teams: <span id="manual-teams-count" style="color: var(--accent-primary); font-weight: bold;">${this.selectedTeams.filter(t => t.isManual).length}</span>
            </div>
        `;

        tournamentTeamGrid.insertBefore(manualInputSection, tournamentTeamGrid.firstChild);

        const addButton = document.getElementById('add-manual-team');
        const nameInput = document.getElementById('manual-team-name');
        const eloInput = document.getElementById('manual-team-elo');

        if (addButton && nameInput && eloInput) {
            addButton.addEventListener('click', () => {
                const teamName = nameInput.value.trim();
                const teamElo = parseInt(eloInput.value);

                if (!teamName || isNaN(teamElo) || teamElo < 0) {
                    alert('Bitte gib einen gültigen Team-Namen und ELO-Rating ein.');
                    return;
                }

                const newTeam = {
                    id: 'manual_' + Date.now(),
                    name: teamName,
                    elo: teamElo,
                    country: teamName,
                    isManual: true
                };

                this.selectedTeams.push(newTeam);
                this.teams.push(newTeam); // Add manual teams to main teams array
                this.populateTeamsGrid(); // Repopulate both grids to include new team
                const newTeamElement = document.querySelector(`#team-grid [data-team-id="${newTeam.id}"]`);
                if (newTeamElement) {
                    newTeamElement.classList.add('selected');
                    newTeamElement.style.backgroundColor = 'var(--accent-primary)';
                    newTeamElement.style.borderColor = 'var(--accent-secondary)';
                    newTeamElement.querySelector('.selection-status').textContent = '✓ Ausgewählt';
                }

                nameInput.value = '';
                eloInput.value = '';

                const countSpan = document.getElementById('manual-teams-count');
                if (countSpan) {
                    countSpan.textContent = this.selectedTeams.filter(t => t.isManual).length;
                }
                this.updateTournamentStructure();
            });
        }
    }

    selectPresetTeam(teamId) {
        const team = this.teams.find(t => t.id === teamId);
        if (!team) return;

        const team1NameInput = document.getElementById('team1-name');
        const team1EloInput = document.getElementById('team1-elo');
        const team2NameInput = document.getElementById('team2-name');
        const team2EloInput = document.getElementById('team2-elo');

        if (!team1NameInput.value) {
            team1NameInput.value = team.name;
            team1EloInput.value = team.elo;
        } else if (!team2NameInput.value) {
            team2NameInput.value = team.name;
            team2EloInput.value = team.elo;
        } else {
            team2NameInput.value = team.name;
            team2EloInput.value = team.elo;
        }
    }

    calculateELOProbability(elo1, elo2) {
        const eloDiff = elo2 - elo1;
        return 1 / (1 + Math.pow(10, eloDiff / 400));
    }

    calculateNewELO(elo1, elo2, result) {
        const expected1 = this.calculateELOProbability(elo1, elo2);
        const expected2 = 1 - expected1;

        const newElo1 = Math.round(elo1 + this.kFactor * (result - expected1));
        const newElo2 = Math.round(elo2 + this.kFactor * ((1 - result) - expected2));

        return {
            newElo1,
            newElo2,
            change1: newElo1 - elo1,
            change2: newElo2 - elo2
        };
    }

    simulateMatch() {
        const team1Name = document.getElementById('team1-name').value;
        const team1Elo = parseInt(document.getElementById('team1-elo').value);
        const team2Name = document.getElementById('team2-name').value;
        const team2Elo = parseInt(document.getElementById('team2-elo').value);
        const simulationCount = parseInt(document.getElementById('simulation-count')?.value || 1);

        if (!team1Name || !team2Name || isNaN(team1Elo) || isNaN(team2Elo)) {
            alert('Bitte fülle alle Felder korrekt aus.');
            return;
        }

        if (team1Name === team2Name) {
            alert('Bitte wähle verschiedene Teams aus.');
            return;
        }

        if (simulationCount < 1 || simulationCount > 1000) {
            alert('Bitte gib eine Anzahl zwischen 1 und 1000 ein.');
            return;
        }

        this.simulationStats = {
            team1Wins: 0,
            team2Wins: 0,
            draws: 0,
            totalGames: 0
        };

        for (let i = 0; i < simulationCount; i++) {
            const result = this.runSingleSimulation(team1Elo, team2Elo);
            this.updateSimulationStats(result);
        }

        if (simulationCount === 1) {
            this.displayMatchResult(team1Name, team2Name, this.simulationStats.lastScore1, this.simulationStats.lastScore2, this.simulationStats.lastEloChanges);
        } else {
            this.displaySimulationStats(team1Name, team2Name);
        }
    }

    runSingleSimulation(elo1, elo2) {
        const team1WinProb = this.calculateELOProbability(elo1, elo2);
        const random = Math.random();

        let result, score1, score2;

        if (random < team1WinProb * 0.7) {
            result = 1;
            score1 = Math.floor(Math.random() * 3) + 1;
            score2 = Math.floor(Math.random() * Math.min(score1, 2));
        } else if (random < team1WinProb * 0.7 + 0.2) {
            result = 0.5;
            score1 = Math.floor(Math.random() * 3);
            score2 = score1;
        } else {
            result = 0;
            score2 = Math.floor(Math.random() * 3) + 1;
            score1 = Math.floor(Math.random() * Math.min(score2, 2));
        }

        const eloChanges = this.calculateNewELO(elo1, elo2, result);

        return {
            result,
            score1,
            score2,
            eloChanges
        };
    }

    updateSimulationStats(simulationResult) {
        this.simulationStats.totalGames++;

        if (simulationResult.result === 1) {
            this.simulationStats.team1Wins++;
        } else if (simulationResult.result === 0) {
            this.simulationStats.team2Wins++;
        } else {
            this.simulationStats.draws++;
        }

        this.simulationStats.lastScore1 = simulationResult.score1;
        this.simulationStats.lastScore2 = simulationResult.score2;
        this.simulationStats.lastEloChanges = simulationResult.eloChanges;
    }

    displayMatchResult(team1Name, team2Name, score1, score2, eloChanges) {
        const resultDiv = document.getElementById('match-result');

        resultDiv.innerHTML = `
            <div class="result-header">
                <h3>Spielergebnis</h3>
            </div>
            <div class="result-content">
                <div class="team-result">
                    <span class="team-name" id="result-team1">${team1Name}</span>
                    <span class="score" id="score-team1">${score1}</span>
                </div>
                <div class="team-result">
                    <span class="team-name" id="result-team2">${team2Name}</span>
                    <span class="score" id="score-team2">${score2}</span>
                </div>
            </div>
            <div class="elo-changes">
                <div class="elo-change">
                    <span>ELO Änderung Team 1:</span>
                    <span id="elo-change1" class="elo-delta ${eloChanges.change1 > 0 ? 'positive' : 'negative'}">${eloChanges.change1 > 0 ? '+' : ''}${eloChanges.change1}</span>
                </div>
                <div class="elo-change">
                    <span>ELO Änderung Team 2:</span>
                    <span id="elo-change2" class="elo-delta ${eloChanges.change2 > 0 ? 'positive' : 'negative'}">${eloChanges.change2 > 0 ? '+' : ''}${eloChanges.change2}</span>
                </div>
            </div>
            <div class="new-ratings">
                <div class="new-rating">
                    <span>Neues ELO Team 1:</span>
                    <span id="new-elo1">${eloChanges.newElo1}</span>
                </div>
                <div class="new-rating">
                    <span>Neues ELO Team 2:</span>
                    <span id="new-elo2">${eloChanges.newElo2}</span>
                </div>
            </div>
        `;

        resultDiv.classList.remove('hidden');
        resultDiv.style.animation = 'none';
        resultDiv.offsetHeight;
        resultDiv.style.animation = 'fadeIn 0.5s ease-in';
    }

    displaySimulationStats(team1Name, team2Name) {
        const resultDiv = document.getElementById('match-result');

        const totalGames = this.simulationStats.totalGames;
        const team1WinRate = ((this.simulationStats.team1Wins / totalGames) * 100).toFixed(1);
        const team2WinRate = ((this.simulationStats.team2Wins / totalGames) * 100).toFixed(1);
        const drawRate = ((this.simulationStats.draws / totalGames) * 100).toFixed(1);

        resultDiv.innerHTML = `
            <div class="result-header">
                <h3>Simulations-Statistiken (${totalGames} Spiele)</h3>
            </div>
            <div class="stats-content">
                <div class="stat-item">
                    <span class="team-name">${team1Name}</span>
                    <span class="stat-value">${this.simulationStats.team1Wins} Siege (${team1WinRate}%)</span>
                </div>
                <div class="stat-item">
                    <span class="team-name">Unentschieden</span>
                    <span class="stat-value">${this.simulationStats.draws} (${drawRate}%)</span>
                </div>
                <div class="stat-item">
                    <span class="team-name">${team2Name}</span>
                    <span class="stat-value">${this.simulationStats.team2Wins} Siege (${team2WinRate}%)</span>
                </div>
            </div>
            <div class="last-result">
                <h4>Letztes Spielergebnis:</h4>
                <div class="result-content">
                    <div class="team-result">
                        <span class="team-name">${team1Name}</span>
                        <span class="score">${this.simulationStats.lastScore1}</span>
                    </div>
                    <div class="team-result">
                        <span class="team-name">${team2Name}</span>
                        <span class="score">${this.simulationStats.lastScore2}</span>
                    </div>
                </div>
            </div>
        `;

        resultDiv.classList.remove('hidden');
        resultDiv.style.animation = 'none';
        resultDiv.offsetHeight;
        resultDiv.style.animation = 'fadeIn 0.5s ease-in';
    }

    populateTeamsGrid() {
        const teamsGrid = document.getElementById('teams-grid');
        const tournamentTeamGrid = document.getElementById('team-grid');

        if (!teamsGrid || !tournamentTeamGrid) {
            return;
        }

        teamsGrid.innerHTML = '';
        const manualInput = tournamentTeamGrid.querySelector('.manual-team-input');
        tournamentTeamGrid.innerHTML = '';
        if (manualInput) {
            tournamentTeamGrid.appendChild(manualInput);
        }

        this.teams.forEach(team => {
            const teamElement = this.createTeamElement(team, false);
            teamsGrid.appendChild(teamElement);

            const tournamentTeamElement = this.createTeamElement(team, true);
            tournamentTeamGrid.appendChild(tournamentTeamElement);

            if (this.selectedTeams.some(t => t.id === team.id)) {
                tournamentTeamElement.classList.add('selected');
                tournamentTeamElement.style.backgroundColor = 'var(--accent-primary)';
                tournamentTeamElement.style.borderColor = 'var(--accent-secondary)';
                tournamentTeamElement.querySelector('.selection-status').textContent = '✓ Ausgewählt';
            }
        });
        const countSpan = document.getElementById('manual-teams-count');
        if (countSpan) {
            countSpan.textContent = this.selectedTeams.filter(t => t.isManual).length;
        }
    }

    createTeamElement(team, isTournament = false) {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-item';
        teamDiv.dataset.teamId = team.id;

        if (isTournament) {
            teamDiv.innerHTML = `
                <h4>${team.name}</h4>
                <div class="elo-rating">${team.elo}</div>
                <div class="country">${team.country}</div>
                <div class="selection-status">Klicken zum Auswählen</div>
            `;

            teamDiv.style.cursor = 'pointer';
            teamDiv.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTeamSelection(team, teamDiv);
            });

            teamDiv.addEventListener('mouseenter', () => {
                if (!teamDiv.classList.contains('selected')) {
                    teamDiv.style.backgroundColor = 'var(--bg-tertiary)';
                }
            });

            teamDiv.addEventListener('mouseleave', () => {
                if (!teamDiv.classList.contains('selected')) {
                    teamDiv.style.backgroundColor = '';
                }
            });

        } else {
            teamDiv.innerHTML = `
                <h4>${team.name}</h4>
                <div class="elo-editable">
                    <label>ELO:</label>
                    <input type="number" class="elo-input" value="${team.elo}" data-team-id="${team.id}">
                </div>
                <div class="country">${team.country}</div>
            `;

            const eloInput = teamDiv.querySelector('.elo-input');
            eloInput.addEventListener('change', (e) => this.updateTeamELO(team.id, parseInt(e.target.value)));
        }

        return teamDiv;
    }

    updateTeamELO(teamId, newElo) {
        const teamIndex = this.teams.findIndex(t => t.id === teamId);
        if (teamIndex !== -1 && !isNaN(newElo) && newElo > 0) {
            this.teams[teamIndex].elo = newElo;

            const tournamentTeam = document.querySelector(`#team-grid [data-team-id="${teamId}"] .elo-rating`);
            if (tournamentTeam) {
                tournamentTeam.textContent = newElo;
            }
        }
    }

    toggleTeamSelection(team, element) {
        const isSelected = element.classList.contains('selected');

        if (isSelected) {
            element.classList.remove('selected');
            element.style.backgroundColor = '';
            element.style.borderColor = '';
            this.selectedTeams = this.selectedTeams.filter(t => t.id !== team.id);
            element.querySelector('.selection-status').textContent = 'Klicken zum Auswählen';
        } else {
            element.classList.add('selected');
            element.style.backgroundColor = 'var(--accent-primary)';
            element.style.borderColor = 'var(--accent-secondary)';
            this.selectedTeams.push(team);
            element.querySelector('.selection-status').textContent = '✓ Ausgewählt';
        }
        const countSpan = document.getElementById('manual-teams-count');
        if (countSpan) {
            countSpan.textContent = this.selectedTeams.filter(t => t.isManual).length;
        }
        this.updateTournamentStructure();
    }

    createTournament() {
        document.getElementById('tournament-builder').classList.remove('hidden');
        this.updateTournamentStructure();
    }

    updateTournamentStructure() {
        const tournamentType = document.querySelector('input[name="tournament-type"]:checked').value;
        const groupCount = parseInt(document.getElementById('group-count').value);
        const teamsPerGroup = parseInt(document.getElementById('teams-per-group').value);
        const simulateButton = document.getElementById('simulate-tournament');

        if (tournamentType === 'groups') {
            document.querySelector('.group-settings').classList.remove('hidden');
            const totalTeamsNeeded = groupCount * teamsPerGroup;
            if (this.selectedTeams.length < totalTeamsNeeded) {
                simulateButton.disabled = true;
                simulateButton.textContent = `Wähle ${totalTeamsNeeded - this.selectedTeams.length} weitere Teams aus`;
                return;
            }
        } else {
            document.querySelector('.group-settings').classList.add('hidden');
            if (this.selectedTeams.length < 2) {
                simulateButton.disabled = true;
                simulateButton.textContent = `Wähle mindestens 2 Teams aus`;
                return;
            }
        }

        simulateButton.disabled = false;
        simulateButton.innerHTML = `<i class="fas fa-play"></i> Turnier simulieren`;
    }

    simulateTournament() {
        const tournamentType = document.querySelector('input[name="tournament-type"]:checked').value;
        const groupCount = parseInt(document.getElementById('group-count').value);
        const teamsPerGroup = parseInt(document.getElementById('teams-per-group').value);

        const simulateButton = document.getElementById('simulate-tournament');
        if (simulateButton.disabled) {
            alert('Bitte wähle die benötigte Anzahl an Teams aus.');
            return;
        }

        this.tournament = this.createTournamentStructure(tournamentType, groupCount, teamsPerGroup);

        this.simulateTournamentMatches();

        this.displayTournamentResults();
    }

    createTournamentStructure(type, groupCount, teamsPerGroup) {
        const tournament = {
            type: type,
            groups: [],
            knockout: [],
            winner: null
        };

        let shuffledTeams = [...this.selectedTeams].sort(() => Math.random() - 0.5);

        if (type === 'groups') {
            for (let i = 0; i < groupCount; i++) {
                const groupTeams = shuffledTeams.splice(0, teamsPerGroup);
                tournament.groups.push({
                    id: i + 1,
                    teams: groupTeams.map(team => ({ ...team, points: 0, goalsFor: 0, goalsAgainst: 0, wins: 0, draws: 0, losses: 0 })),
                    matches: []
                });
            }

            tournament.groups.forEach(group => {
                for (let i = 0; i < group.teams.length; i++) {
                    for (let j = i + 1; j < group.teams.length; j++) {
                        group.matches.push({
                            team1: group.teams[i],
                            team2: group.teams[j],
                            score1: 0,
                            score2: 0,
                            played: false
                        });
                    }
                }
            });
        } else {
            tournament.knockout = this.createKnockoutBracket(shuffledTeams);
        }

        return tournament;
    }

    createKnockoutBracket(teams) {
        let bracket = [];
        let currentRoundTeams = [...teams];
        let roundNum = 1;

        while (currentRoundTeams.length > 1) {
            let nextRoundTeams = [];
            let roundMatches = [];
            let numByes = 0;
            const requiredTeams = Math.pow(2, Math.ceil(Math.log2(currentRoundTeams.length)));
            if (currentRoundTeams.length < requiredTeams) {
                numByes = requiredTeams - currentRoundTeams.length;
            }

            // Add byes to fill up the bracket to a power of 2
            for (let i = 0; i < numByes; i++) {
                currentRoundTeams.splice(Math.floor(Math.random() * (currentRoundTeams.length + 1)), 0, { name: 'BYE', elo: 0, isBye: true, id: 'bye_' + Date.now() + i });
            }

            for (let i = 0; i < currentRoundTeams.length; i += 2) {
                const team1 = currentRoundTeams[i];
                const team2 = currentRoundTeams[i + 1];

                if (!team1 || !team2) {
                    continue;
                }

                roundMatches.push({
                    team1: team1,
                    team2: team2,
                    score1: 0,
                    score2: 0,
                    played: false,
                    winner: null
                });
                nextRoundTeams.push(null);
            }
            bracket.push({
                round: roundNum,
                matches: roundMatches
            });
            currentRoundTeams = nextRoundTeams;
            roundNum++;
        }
        return bracket;
    }


    simulateTournamentMatches() {
        if (this.tournament.type === 'groups') {
            this.simulateGroupStage();
            this.simulateKnockoutStage();
        } else {
            this.simulateDirectKnockout();
        }
    }

    simulateGroupStage() {
        this.tournament.groups.forEach(group => {
            group.matches.forEach(match => {
                if (match.team1.isBye || match.team2.isBye) return;

                const result = this.simulateMatchResult(match.team1, match.team2);
                match.score1 = result.score1;
                match.score2 = result.score2;
                match.played = true;

                this.updateGroupStandings(group, match);
            });
        });

        this.tournament.groups.forEach(group => {
            group.teams.sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                const goalDiffA = a.goalsFor - a.goalsAgainst;
                const goalDiffB = b.goalsFor - b.goalsAgainst;
                if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
                return b.goalsFor - a.goalsFor;
            });
        });
    }

    simulateMatchResult(team1, team2) {
        const team1WinProb = this.calculateELOProbability(team1.elo, team2.elo);
        const random = Math.random();

        let score1, score2;

        if (random < team1WinProb * 0.7) {
            score1 = Math.floor(Math.random() * 3) + 1;
            score2 = Math.floor(Math.random() * Math.min(score1, 2));
        } else if (random < team1WinProb * 0.7 + 0.2) {
            score1 = Math.floor(Math.random() * 3);
            score2 = score1;
        } else {
            score2 = Math.floor(Math.random() * 3) + 1;
            score1 = Math.floor(Math.random() * Math.min(score2, 2));
        }

        return { score1, score2 };
    }

    updateGroupStandings(group, match) {
        const team1 = group.teams.find(t => t.id === match.team1.id);
        const team2 = group.teams.find(t => t.id === match.team2.id);

        team1.goalsFor += match.score1;
        team1.goalsAgainst += match.score2;
        team2.goalsFor += match.score2;
        team2.goalsAgainst += match.score1;

        if (match.score1 > match.score2) {
            team1.points += 3;
            team1.wins++;
            team2.losses++;
        } else if (match.score1 < match.score2) {
            team2.points += 3;
            team2.wins++;
            team1.losses++;
        } else {
            team1.points += 1;
            team2.points += 1;
            team1.draws++;
            team2.draws++;
        }
    }

    simulateKnockoutStage() {
        const knockoutTeams = [];
        this.tournament.groups.forEach(group => {
            knockoutTeams.push(group.teams[0], group.teams[1]);
        });

        this.tournament.knockout = this.createKnockoutBracket(knockoutTeams);
        this.simulateDirectKnockout();
    }

    simulateDirectKnockout() {
        for (let roundIndex = 0; roundIndex < this.tournament.knockout.length; roundIndex++) {
            const currentRound = this.tournament.knockout[roundIndex];
            const nextRoundMatches = [];

            for (let matchIndex = 0; matchIndex < currentRound.matches.length; matchIndex++) {
                const match = currentRound.matches[matchIndex];
                let winnerTeam = null;

                if (match.team1.isBye && match.team2.isBye) {
                    winnerTeam = null;
                } else if (match.team1.isBye) {
                    winnerTeam = match.team2;
                } else if (match.team2.isBye) {
                    winnerTeam = match.team1;
                } else {
                    const result = this.simulateMatchResult(match.team1, match.team2);
                    match.score1 = result.score1;
                    match.score2 = result.score2;
                    match.played = true;

                    if (match.score1 > match.score2) {
                        winnerTeam = match.team1;
                    } else if (match.score1 < match.score2) {
                        winnerTeam = match.team2;
                    } else {
                        winnerTeam = Math.random() < 0.5 ? match.team1 : match.team2;
                        match.score1++; // Resolve tie for knockout
                    }
                }
                match.winner = winnerTeam;
                if (winnerTeam) {
                    nextRoundMatches.push(winnerTeam);
                }
            }

            if (roundIndex < this.tournament.knockout.length - 1) {
                const nextRoundBracket = this.createKnockoutBracket(nextRoundMatches);
                this.tournament.knockout[roundIndex + 1].matches = nextRoundBracket[0].matches;
            }
        }
        const finalRound = this.tournament.knockout[this.tournament.knockout.length - 1];
        if (finalRound && finalRound.matches[0] && finalRound.matches[0].winner) {
            this.tournament.winner = finalRound.matches[0].winner;
        }
    }

    displayTournamentResults() {
        const bracketDiv = document.getElementById('tournament-bracket');
        bracketDiv.classList.remove('hidden');

        let html = '<h3 class="section-title">Turnierergebnisse</h3>';

        if (this.tournament.type === 'groups') {
            html += this.generateGroupResultsHTML();
        }

        html += this.generateKnockoutResultsHTML();

        if (this.tournament.winner) {
            html += `
                <div class="tournament-winner">
                    <h4>🏆 Turniersieger: ${this.tournament.winner.name}</h4>
                    <p>ELO Rating: ${this.tournament.winner.elo}</p>
                </div>
            `;
        }

        bracketDiv.innerHTML = html;
        bracketDiv.scrollIntoView({ behavior: 'smooth' });
    }

    generateGroupResultsHTML() {
        let html = '<div class="group-results">';

        this.tournament.groups.forEach(group => {
            html += `
                <div class="group">
                    <h4>Gruppe ${group.id}</h4>
                    <table class="standings-table">
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>Sp.</th>
                                <th>S</th>
                                <th>U</th>
                                <th>N</th>
                                <th>Tore</th>
                                <th>Diff</th>
                                <th>Pkt</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            group.teams.forEach(team => {
                const goalDiff = team.goalsFor - team.goalsAgainst;
                const gamesPlayed = team.wins + team.draws + team.losses;
                html += `
                    <tr>
                        <td>${team.name}</td>
                        <td>${gamesPlayed}</td>
                        <td>${team.wins}</td>
                        <td>${team.draws}</td>
                        <td>${team.losses}</td>
                        <td>${team.goalsFor}:${team.goalsAgainst}</td>
                        <td>${goalDiff > 0 ? '+' : ''}${goalDiff}</td>
                        <td>${team.points}</td>
                    </tr>
                `;
            });

            html += '</tbody></table></div>';
        });

        html += '</div>';
        return html;
    }

    generateKnockoutResultsHTML() {
        let html = '<div class="knockout-results">';

        this.tournament.knockout.forEach(round => {
            html += `<h4>Runde ${round.round}</h4>`;

            round.matches.forEach((match) => {
                const team1Name = match.team1 ? (match.team1.isBye ? 'BYE' : match.team1.name) : 'TBD';
                const team2Name = match.team2 ? (match.team2.isBye ? 'BYE' : match.team2.name) : 'TBD';

                html += `
                    <div class="match-result">
                        <span>${team1Name}</span>
                        <span class="score">${match.played ? match.score1 : '-'}</span>
                        <span>vs</span>
                        <span class="score">${match.played ? match.score2 : '-'}</span>
                        <span>${team2Name}</span>
                        ${match.winner && !match.winner.isBye ? `<span class="winner">🏆 ${match.winner.name}</span>` : ''}
                    </div>
                `;
            });
        });

        html += '</div>';
        return html;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ELOSimulator();
});