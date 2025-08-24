// ELO Football Simulator - Main JavaScript File

class ELOSimulator {
    constructor() {
        this.teams = this.initializeTeams();
        this.selectedTeams = [];
        this.tournament = null;
        this.kFactor = 32; // Standard K-Faktor für Fußball
        this.simulationStats = {
            team1Wins: 0,
            team2Wins: 0,
            draws: 0,
            totalGames: 0
        };
        
        this.initializeEventListeners();
        this.populateTeamsGrid();
    }

    // Initialize predefined teams with ELO ratings
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

    // Initialize all event listeners
    initializeEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Preset team buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectPresetTeam(e.target.dataset.team));
        });

        // Simulate match button
        document.getElementById('simulate-match').addEventListener('click', () => this.simulateMatch());

        // Tournament controls
        document.getElementById('create-tournament').addEventListener('click', () => this.createTournament());
        document.getElementById('simulate-tournament').addEventListener('click', () => this.simulateTournament());

        // Tournament structure changes
        document.getElementById('group-count').addEventListener('change', () => this.updateTournamentStructure());
        document.getElementById('teams-per-group').addEventListener('change', () => this.updateTournamentStructure());
    }

    // Switch between tabs
    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab and activate button
        const targetTab = document.getElementById(tabName);
        const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (!targetTab) {
            console.error(`Tab with id "${tabName}" not found!`);
            return;
        }
        
        if (!targetButton) {
            console.error(`Button with data-tab="${tabName}" not found!`);
            return;
        }
        
        targetTab.classList.add('active');
        targetButton.classList.add('active');
        
        console.log(`Successfully switched to tab: ${tabName}`);
        
        // If switching to tournament tab, make sure teams are visible and populated
        if (tabName === 'tournament') {
            console.log('Tournament tab activated, checking team grid...');
            const teamGrid = document.getElementById('team-grid');
            if (teamGrid) {
                console.log('Team grid found, children count:', teamGrid.children.length);
                
                // If no teams are displayed, repopulate the grid
                if (teamGrid.children.length === 0) {
                    console.log('No teams in tournament grid, repopulating...');
                    this.populateTeamsGrid();
                }
                
                // Force teams to be visible
                teamGrid.style.display = 'grid';
                teamGrid.style.visibility = 'visible';
                teamGrid.style.opacity = '1';
                
                // Make sure all team items are visible
                teamGrid.querySelectorAll('.team-item').forEach(teamItem => {
                    teamItem.style.display = 'block';
                    teamItem.style.visibility = 'visible';
                    teamItem.style.opacity = '1';
                });
                
                console.log('Tournament grid refreshed, teams should now be visible');
            }
        }
    }

    // Select preset team
    selectPresetTeam(teamId) {
        const team = this.teams.find(t => t.id === teamId);
        if (!team) return;

        // Find which team slot to fill (check if team1 or team2 inputs are empty)
        const team1Name = document.getElementById('team1-name').value;
        const team2Name = document.getElementById('team2-name').value;

        if (!team1Name) {
            document.getElementById('team1-name').value = team.name;
            document.getElementById('team1-elo').value = team.elo;
        } else if (!team2Name) {
            document.getElementById('team2-name').value = team.name;
            document.getElementById('team2-elo').value = team.elo;
        } else {
            // Both filled, replace team2
            document.getElementById('team2-name').value = team.name;
            document.getElementById('team2-elo').value = team.elo;
        }
    }

    // Calculate ELO probability
    calculateELOProbability(elo1, elo2) {
        const eloDiff = elo2 - elo1;
        return 1 / (1 + Math.pow(10, eloDiff / 400));
    }

    // Calculate new ELO ratings
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

    // Simulate a single match
    simulateMatch() {
        const team1Name = document.getElementById('team1-name').value;
        const team1Elo = parseInt(document.getElementById('team1-elo').value);
        const team2Name = document.getElementById('team2-name').value;
        const team2Elo = parseInt(document.getElementById('team2-elo').value);
        const simulationCount = parseInt(document.getElementById('simulation-count')?.value || 1);

        // Validation
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

        // Reset statistics
        this.simulationStats = {
            team1Wins: 0,
            team2Wins: 0,
            draws: 0,
            totalGames: 0
        };

        // Run simulations
        for (let i = 0; i < simulationCount; i++) {
            const result = this.runSingleSimulation(team1Elo, team2Elo);
            this.updateSimulationStats(result);
        }

        // Display results
        if (simulationCount === 1) {
            // Single match - show detailed result
            this.displayMatchResult(team1Name, team2Name, this.simulationStats.lastScore1, this.simulationStats.lastScore2, this.simulationStats.lastEloChanges);
        } else {
            // Multiple simulations - show statistics
            this.displaySimulationStats(team1Name, team2Name);
        }
    }

    // Run a single simulation
    runSingleSimulation(elo1, elo2) {
        const team1WinProb = this.calculateELOProbability(elo1, elo2);
        const random = Math.random();
        
        let result, score1, score2;
        
        if (random < team1WinProb) {
            // Team 1 wins
            result = 1;
            score1 = Math.floor(Math.random() * 3) + 1;
            score2 = Math.floor(score1 * Math.random());
        } else if (random < team1WinProb + 0.2) {
            // Draw
            result = 0.5;
            score1 = Math.floor(Math.random() * 3);
            score2 = score1;
        } else {
            // Team 2 wins
            result = 0;
            score2 = Math.floor(Math.random() * 3) + 1;
            score1 = Math.floor(score2 * Math.random());
        }

        // Calculate ELO changes for the last simulation
        const eloChanges = this.calculateNewELO(elo1, elo2, result);
        
        return {
            result,
            score1,
            score2,
            eloChanges
        };
    }

    // Update simulation statistics
    updateSimulationStats(simulationResult) {
        this.simulationStats.totalGames++;
        
        if (simulationResult.result === 1) {
            this.simulationStats.team1Wins++;
        } else if (simulationResult.result === 0) {
            this.simulationStats.team2Wins++;
        } else {
            this.simulationStats.draws++;
        }

        // Store last result for single match display
        this.simulationStats.lastScore1 = simulationResult.score1;
        this.simulationStats.lastScore2 = simulationResult.score2;
        this.simulationStats.lastEloChanges = simulationResult.eloChanges;
    }

    // Display match result
    displayMatchResult(team1Name, team2Name, score1, score2, eloChanges) {
        const resultDiv = document.getElementById('match-result');
        
        // Set team names and scores
        document.getElementById('result-team1').textContent = team1Name;
        document.getElementById('result-team2').textContent = team2Name;
        document.getElementById('score-team1').textContent = score1;
        document.getElementById('score-team2').textContent = score2;

        // Set ELO changes
        const eloChange1 = document.getElementById('elo-change1');
        const eloChange2 = document.getElementById('elo-change2');
        
        eloChange1.textContent = `${eloChanges.change1 > 0 ? '+' : ''}${eloChanges.change1}`;
        eloChange2.textContent = `${eloChanges.change2 > 0 ? '+' : ''}${eloChanges.change2}`;
        
        eloChange1.className = `elo-delta ${eloChanges.change1 > 0 ? 'positive' : 'negative'}`;
        eloChange2.className = `elo-delta ${eloChanges.change2 > 0 ? 'positive' : 'negative'}`;

        // Set new ELO ratings
        document.getElementById('new-elo1').textContent = eloChanges.newElo1;
        document.getElementById('new-elo2').textContent = eloChanges.newElo2;

        // Show result with animation
        resultDiv.classList.remove('hidden');
        resultDiv.style.animation = 'none';
        resultDiv.offsetHeight; // Trigger reflow
        resultDiv.style.animation = 'fadeIn 0.5s ease-in';
    }

    // Display simulation statistics
    displaySimulationStats(team1Name, team2Name) {
        const resultDiv = document.getElementById('match-result');
        
        const totalGames = this.simulationStats.totalGames;
        const team1WinRate = ((this.simulationStats.team1Wins / totalGames) * 100).toFixed(1);
        const team2WinRate = ((this.simulationStats.team2Wins / totalGames) * 100).toFixed(1);
        const drawRate = ((this.simulationStats.draws / totalGames) * 100).toFixed(1);

        // Update result display for statistics
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

        // Show result with animation
        resultDiv.classList.remove('hidden');
        resultDiv.style.animation = 'none';
        resultDiv.offsetHeight; // Trigger reflow
        resultDiv.style.animation = 'fadeIn 0.5s ease-in';
    }

    // Populate teams grid
    populateTeamsGrid() {
        console.log('Populating teams grid...');
        
        const teamsGrid = document.getElementById('teams-grid');
        const tournamentTeamGrid = document.getElementById('team-grid');
        
        if (!teamsGrid || !tournamentTeamGrid) {
            console.error('Grid elements not found!');
            return;
        }
        
        // Clear existing content
        teamsGrid.innerHTML = '';
        tournamentTeamGrid.innerHTML = '';
        
        console.log('Teams to display:', this.teams);
        
        this.teams.forEach((team, index) => {
            console.log(`Creating element ${index + 1} for team:`, team.name);
            
            // Teams overview tab (with editable ELO)
            const teamElement = this.createTeamElement(team, false);
            teamsGrid.appendChild(teamElement);
            
            // Tournament selection tab (clickable for selection)
            const tournamentTeamElement = this.createTeamElement(team, true);
            tournamentTeamGrid.appendChild(tournamentTeamElement);
        });
        
        console.log('Teams grid populated. Teams overview count:', teamsGrid.children.length);
        console.log('Tournament grid count:', tournamentTeamGrid.children.length);
        
        // Add manual team input for tournaments
        this.addManualTeamInput();
    }

    // Add manual team input for tournaments
    addManualTeamInput() {
        const tournamentTeamGrid = document.getElementById('team-grid');
        if (!tournamentTeamGrid) return;
        
        // Create manual input section
        const manualInputSection = document.createElement('div');
        manualInputSection.className = 'manual-team-input';
        manualInputSection.style.cssText = `
            grid-column: 1 / -1;
            background: var(--bg-primary);
            border: 2px solid var(--accent-primary);
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
        `;
        
        manualInputSection.innerHTML = `
            <h4 style="color: var(--accent-primary); margin-bottom: 1rem;">🏆 Manuell Team hinzufügen</h4>
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                <input type="text" id="manual-team-name" placeholder="Team Name" style="
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    padding: 0.5rem;
                    border-radius: 4px;
                    min-width: 150px;
                ">
                <input type="number" id="manual-team-elo" placeholder="ELO Rating" style="
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    padding: 0.5rem;
                    border-radius: 4px;
                    width: 100px;
                ">
                <button id="add-manual-team" style="
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                ">Team hinzufügen</button>
            </div>
            <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                Hinzugefügte Teams: <span id="manual-teams-count">0</span>
            </div>
        `;
        
        // Insert at the beginning of the tournament grid
        tournamentTeamGrid.insertBefore(manualInputSection, tournamentTeamGrid.firstChild);
        
        // Add event listener for adding manual teams
        const addButton = document.getElementById('add-manual-team');
        const nameInput = document.getElementById('manual-team-name');
        const eloInput = document.getElementById('manual-team-elo');
        
        addButton.addEventListener('click', () => {
            const teamName = nameInput.value.trim();
            const teamElo = parseInt(eloInput.value);
            
            if (!teamName || isNaN(teamElo) || teamElo < 0) {
                alert('Bitte gib einen gültigen Team-Namen und ELO-Rating ein.');
                return;
            }
            
            // Create new team
            const newTeam = {
                id: 'manual_' + Date.now(),
                name: teamName,
                elo: teamElo,
                country: teamName,
                isManual: true
            };
            
            // Add to selected teams
            this.selectedTeams.push(newTeam);
            
            // Create and add team element
            const teamElement = this.createTeamElement(newTeam, true);
            teamElement.classList.add('selected');
            teamElement.style.backgroundColor = 'var(--accent-primary)';
            teamElement.style.borderColor = 'var(--accent-secondary)';
            teamElement.querySelector('.selection-status').textContent = '✓ Ausgewählt';
            
            tournamentTeamGrid.appendChild(teamElement);
            
            // Clear inputs
            nameInput.value = '';
            eloInput.value = '';
            
            // Update count
            const countSpan = document.getElementById('manual-teams-count');
            countSpan.textContent = this.selectedTeams.length;
            
            console.log('Manual team added:', newTeam.name, 'Total selected:', this.selectedTeams.length);
            
            // Update tournament structure
            this.updateTournamentStructure();
        });
    }

    // Create team element
    createTeamElement(team, isTournament = false) {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-item';
        teamDiv.dataset.teamId = team.id;
        
        if (isTournament) {
            // Tournament view - clickable for selection
            teamDiv.innerHTML = `
                <h4>${team.name}</h4>
                <div class="elo-rating">${team.elo}</div>
                <div class="country">${team.country}</div>
                <div class="selection-status">Klicken zum Auswählen</div>
            `;
            
            // Make the entire div clickable
            teamDiv.style.cursor = 'pointer';
            teamDiv.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTeamSelection(team, teamDiv);
            });
            
            // Add hover effect
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
            // Teams overview - editable ELO
            teamDiv.innerHTML = `
                <h4>${team.name}</h4>
                <div class="elo-editable">
                    <label>ELO:</label>
                    <input type="number" class="elo-input" value="${team.elo}" data-team-id="${team.id}">
                </div>
                <div class="country">${team.country}</div>
            `;
            
            // Add event listener for ELO editing
            const eloInput = teamDiv.querySelector('.elo-input');
            eloInput.addEventListener('change', (e) => this.updateTeamELO(team.id, parseInt(e.target.value)));
        }

        return teamDiv;
    }

    // Update team ELO value
    updateTeamELO(teamId, newElo) {
        const team = this.teams.find(t => t.id === teamId);
        if (team && !isNaN(newElo) && newElo > 0) {
            team.elo = newElo;
            
            // Update tournament grid if it exists
            const tournamentTeam = document.querySelector(`#team-grid [data-team-id="${teamId}"] .elo-rating`);
            if (tournamentTeam) {
                tournamentTeam.textContent = newElo;
            }
        }
    }

    // Toggle team selection for tournament
    toggleTeamSelection(team, element) {
        console.log('Toggling team selection for:', team.name);
        
        const isSelected = element.classList.contains('selected');
        
        if (isSelected) {
            // Remove selection
            element.classList.remove('selected');
            element.style.backgroundColor = '';
            element.style.borderColor = '';
            this.selectedTeams = this.selectedTeams.filter(t => t.id !== team.id);
            element.querySelector('.selection-status').textContent = 'Klicken zum Auswählen';
        } else {
            // Add selection
            element.classList.add('selected');
            element.style.backgroundColor = 'var(--accent-primary)';
            element.style.borderColor = 'var(--accent-secondary)';
            this.selectedTeams.push(team);
            element.querySelector('.selection-status').textContent = '✓ Ausgewählt';
        }
        
        console.log('Selected teams:', this.selectedTeams.map(t => t.name));
        console.log('Selected teams count:', this.selectedTeams.length);
        
        // Update tournament structure
        this.updateTournamentStructure();
    }

    // Create tournament
    createTournament() {
        if (this.selectedTeams.length < 4) {
            alert('Bitte wähle mindestens 4 Teams aus.');
            return;
        }

        document.getElementById('tournament-builder').classList.remove('hidden');
        document.getElementById('simulate-tournament').disabled = false;
        this.updateTournamentStructure();
    }

    // Update tournament structure
    updateTournamentStructure() {
        if (!this.selectedTeams.length) return;

        const groupCount = parseInt(document.getElementById('group-count').value);
        const teamsPerGroup = parseInt(document.getElementById('teams-per-group').value);
        const totalTeamsNeeded = groupCount * teamsPerGroup;

        if (this.selectedTeams.length < totalTeamsNeeded) {
            document.getElementById('simulate-tournament').disabled = true;
            return;
        }

        document.getElementById('simulate-tournament').disabled = false;
    }

    // Simulate tournament
    simulateTournament() {
        const tournamentType = document.querySelector('input[name="tournament-type"]:checked').value;
        const groupCount = parseInt(document.getElementById('group-count').value);
        const teamsPerGroup = parseInt(document.getElementById('teams-per-group').value);

        if (this.selectedTeams.length < groupCount * teamsPerGroup) {
            alert('Nicht genügend Teams ausgewählt.');
            return;
        }

        // Create tournament structure
        this.tournament = this.createTournamentStructure(tournamentType, groupCount, teamsPerGroup);
        
        // Simulate all matches
        this.simulateTournamentMatches();
        
        // Display results
        this.displayTournamentResults();
    }

    // Create tournament structure
    createTournamentStructure(type, groupCount, teamsPerGroup) {
        const tournament = {
            type: type,
            groups: [],
            knockout: [],
            winner: null
        };

        if (type === 'groups') {
            // Create groups
            const shuffledTeams = [...this.selectedTeams].sort(() => Math.random() - 0.5);
            
            for (let i = 0; i < groupCount; i++) {
                const groupTeams = shuffledTeams.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
                tournament.groups.push({
                    id: i + 1,
                    teams: groupTeams.map(team => ({ ...team, points: 0, goalsFor: 0, goalsAgainst: 0 })),
                    matches: []
                });
            }

            // Generate group matches
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
            // Direct knockout
            const shuffledTeams = [...this.selectedTeams].sort(() => Math.random() - 0.5);
            tournament.knockout = this.createKnockoutBracket(shuffledTeams);
        }

        return tournament;
    }

    // Create knockout bracket
    createKnockoutBracket(teams) {
        const bracket = [];
        const rounds = Math.ceil(Math.log2(teams.length));
        const totalSlots = Math.pow(2, rounds);
        
        // Fill with teams and byes
        const bracketTeams = [...teams];
        while (bracketTeams.length < totalSlots) {
            bracketTeams.push({ name: 'BYE', elo: 0, isBye: true });
        }

        // Create rounds
        for (let round = 0; round < rounds; round++) {
            const roundMatches = [];
            const matchesInRound = Math.pow(2, rounds - round - 1);
            
            for (let match = 0; match < matchesInRound; match++) {
                const team1Index = match * 2;
                const team2Index = match * 2 + 1;
                
                roundMatches.push({
                    team1: bracketTeams[team1Index] || null,
                    team2: bracketTeams[team2Index] || null,
                    score1: 0,
                    score2: 0,
                    played: false,
                    winner: null
                });
            }
            
            bracket.push({
                round: round + 1,
                matches: roundMatches
            });
        }

        return bracket;
    }

    // Simulate tournament matches
    simulateTournamentMatches() {
        if (this.tournament.type === 'groups') {
            this.simulateGroupStage();
            this.simulateKnockoutStage();
        } else {
            this.simulateDirectKnockout();
        }
    }

    // Simulate group stage
    simulateGroupStage() {
        this.tournament.groups.forEach(group => {
            group.matches.forEach(match => {
                if (match.team1.isBye || match.team2.isBye) return;
                
                const result = this.simulateMatchResult(match.team1, match.team2);
                match.score1 = result.score1;
                match.score2 = result.score2;
                match.played = true;
                
                // Update group standings
                this.updateGroupStandings(group, match);
            });
        });

        // Sort teams in each group
        this.tournament.groups.forEach(group => {
            group.teams.sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                if ((b.goalsFor - b.goalsAgainst) !== (a.goalsFor - a.goalsAgainst)) {
                    return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
                }
                return b.goalsFor - a.goalsFor;
            });
        });
    }

    // Simulate match result
    simulateMatchResult(team1, team2) {
        const team1WinProb = this.calculateELOProbability(team1.elo, team2.elo);
        const random = Math.random();
        
        let score1, score2;
        
        if (random < team1WinProb) {
            // Team 1 wins
            score1 = Math.floor(Math.random() * 3) + 1;
            score2 = Math.floor(score1 * Math.random());
        } else if (random < team1WinProb + 0.2) {
            // Draw
            score1 = Math.floor(Math.random() * 3);
            score2 = score1;
        } else {
            // Team 2 wins
            score2 = Math.floor(Math.random() * 3) + 1;
            score1 = Math.floor(score2 * Math.random());
        }
        
        return { score1, score2 };
    }

    // Update group standings
    updateGroupStandings(group, match) {
        const team1 = group.teams.find(t => t.name === match.team1.name);
        const team2 = group.teams.find(t => t.name === match.team2.name);
        
        team1.goalsFor += match.score1;
        team1.goalsAgainst += match.score2;
        team2.goalsFor += match.score2;
        team2.goalsAgainst += match.score1;
        
        if (match.score1 > match.score2) {
            team1.points += 3;
        } else if (match.score1 < match.score2) {
            team2.points += 3;
        } else {
            team1.points += 1;
            team2.points += 1;
        }
    }

    // Simulate knockout stage
    simulateKnockoutStage() {
        // Get top 2 teams from each group
        const knockoutTeams = [];
        this.tournament.groups.forEach(group => {
            knockoutTeams.push(group.teams[0], group.teams[1]);
        });
        
        this.tournament.knockout = this.createKnockoutBracket(knockoutTeams);
        this.simulateDirectKnockout();
    }

    // Simulate direct knockout
    simulateDirectKnockout() {
        this.tournament.knockout.forEach(round => {
            round.matches.forEach(match => {
                if (match.team1 && match.team2 && !match.team1.isBye && !match.team2.isBye) {
                    const result = this.simulateMatchResult(match.team1, match.team2);
                    match.score1 = result.score1;
                    match.score2 = result.score2;
                    match.played = true;
                    match.winner = result.score1 > result.score2 ? match.team1 : match.team2;
                } else if (match.team1 && !match.team1.isBye) {
                    match.winner = match.team1;
                } else if (match.team2 && !match.team2.isBye) {
                    match.winner = match.team2;
                }
            });
        });

        // Determine winner
        const finalRound = this.tournament.knockout[this.tournament.knockout.length - 1];
        if (finalRound.matches[0].winner) {
            this.tournament.winner = finalRound.matches[0].winner;
        }
    }

    // Display tournament results
    displayTournamentResults() {
        const bracketDiv = document.getElementById('tournament-bracket');
        bracketDiv.classList.remove('hidden');
        
        let html = '<h3>Turnierergebnisse</h3>';
        
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
    }

    // Generate group results HTML
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
                                <th>Pkt</th>
                                <th>Tore</th>
                                <th>Diff</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            group.teams.forEach(team => {
                const goalDiff = team.goalsFor - team.goalsAgainst;
                html += `
                    <tr>
                        <td>${team.name}</td>
                        <td>${team.points}</td>
                        <td>${team.goalsFor}:${team.goalsAgainst}</td>
                        <td>${goalDiff > 0 ? '+' : ''}${goalDiff}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table></div>';
        });
        
        html += '</div>';
        return html;
    }

    // Generate knockout results HTML
    generateKnockoutResultsHTML() {
        let html = '<div class="knockout-results">';
        
        this.tournament.knockout.forEach(round => {
            html += `<h4>Runde ${round.round}</h4>`;
            
            round.matches.forEach((match, index) => {
                if (match.team1 && match.team2) {
                    const team1Name = match.team1.isBye ? 'BYE' : match.team1.name;
                    const team2Name = match.team2.isBye ? 'BYE' : match.team2.name;
                    
                    html += `
                        <div class="match-result">
                            <span>${team1Name}</span>
                            <span class="score">${match.played ? match.score1 : '-'}</span>
                            <span>vs</span>
                            <span class="score">${match.played ? match.score2 : '-'}</span>
                            <span>${team2Name}</span>
                            ${match.winner ? `<span class="winner">🏆 ${match.winner.name}</span>` : ''}
                        </div>
                    `;
                }
            });
        });
        
        html += '</div>';
        return html;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ELOSimulator();
});
// Add some additional CSS for tournament results
const additionalStyles = `
    .group-results {
        display: grid;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .group {
        background: var(--bg-primary);
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid var(--border-color);
    }
    
    .group h4 {
        color: var(--accent-primary);
        margin-bottom: 1rem;
        text-align: center;
    }
    
    .standings-table {
        width: 100%;
        border-collapse: collapse;
        color: var(--text-secondary);
    }
    
    .standings-table th,
    .standings-table td {
        padding: 0.5rem;
        text-align: center;
        border-bottom: 1px solid var(--border-color);
    }
    
    .standings-table th {
        background: var(--bg-tertiary);
        color: var(--accent-primary);
        font-weight: 600;
    }
    
    .knockout-results {
        background: var(--bg-primary);
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid var(--border-color);
    }
    
    .knockout-results h4 {
        color: var(--accent-primary);
        margin-bottom: 1rem;
        text-align: center;
    }
    
    .match-result {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: var(--bg-tertiary);
        border-radius: 6px;
        margin-bottom: 0.5rem;
        border: 1px solid var(--border-color);
    }
    
    .match-result .score {
        font-weight: 700;
        color: var(--accent-primary);
        min-width: 30px;
        text-align: center;
    }
    
    .match-result .winner {
        color: var(--accent-primary);
        font-weight: 600;
        margin-left: 1rem;
    }
    
    .tournament-winner {
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        color: var(--bg-primary);
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        margin-top: 2rem;
        box-shadow: 0 0 30px var(--glow-color);
    }
    
    .tournament-winner h4 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    .tournament-winner p {
        font-size: 1.2rem;
        font-weight: 600;
    }

    .elo-editable {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .elo-editable label {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .elo-input {
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        width: 80px;
        font-size: 0.9rem;
    }

    .elo-input:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 0 10px var(--shadow-color);
    }

    .stats-content {
        display: grid;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--bg-primary);
        border-radius: 8px;
        border: 1px solid var(--border-color);
    }

    .stat-value {
        font-weight: 600;
        color: var(--accent-primary);
        font-size: 1.1rem;
    }

    .last-result {
        background: var(--bg-primary);
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid var(--border-color);
        margin-top: 1rem;
    }

    .last-result h4 {
        color: var(--accent-primary);
        margin-bottom: 1rem;
        text-align: center;
    }

    .manual-team-input {
        grid-column: 1 / -1;
        background: var(--bg-primary);
        border: 2px solid var(--accent-primary);
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
    }

    .manual-team-input h4 {
        color: var(--accent-primary);
        margin-bottom: 1rem;
    }

    .manual-team-input input[type="text"],
    .manual-team-input input[type="number"] {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        padding: 0.5rem;
        border-radius: 4px;
        min-width: 150px;
        width: 100px;
    }

    .manual-team-input button {
        background: var(--accent-primary);
        color: var(--bg-primary);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
    }

    .manual-team-input .manual-teams-count {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

