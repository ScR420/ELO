// ELO Football Simulator - Main JavaScript File

class ELOSimulator {
    constructor() {
        this.teams = this.initializeTeams();
        this.selectedTeams = [];
        this.tournament = null;
        this.kFactor = 32; // Standard K-Faktor für Fußball
        
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
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab and activate button
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
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

        // Validation
        if (!team1Name || !team2Name || isNaN(team1Elo) || isNaN(team2Elo)) {
            alert('Bitte fülle alle Felder korrekt aus.');
            return;
        }

        if (team1Name === team2Name) {
            alert('Bitte wähle verschiedene Teams aus.');
            return;
        }

        // Calculate win probabilities
        const team1WinProb = this.calculateELOProbability(team1Elo, team2Elo);
        const team2WinProb = 1 - team1WinProb;

        // Simulate match result using probabilities
        const random = Math.random();
        let result, score1, score2;

        if (random < team1WinProb) {
            // Team 1 wins
            result = 1;
            score1 = Math.floor(Math.random() * 3) + 1; // 1-3 goals
            score2 = Math.floor(score1 * Math.random()); // 0 to score1-1 goals
        } else if (random < team1WinProb + 0.2) {
            // Draw (20% chance)
            result = 0.5;
            score1 = Math.floor(Math.random() * 3);
            score2 = score1;
        } else {
            // Team 2 wins
            result = 0;
            score2 = Math.floor(Math.random() * 3) + 1;
            score1 = Math.floor(score2 * Math.random());
        }

        // Calculate new ELO ratings
        const eloChanges = this.calculateNewELO(team1Elo, team2Elo, result);

        // Display results
        this.displayMatchResult(team1Name, team2Name, score1, score2, eloChanges);
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

    // Populate teams grid
    populateTeamsGrid() {
        const teamsGrid = document.getElementById('teams-grid');
        const tournamentTeamGrid = document.getElementById('team-grid');
        
        this.teams.forEach(team => {
            const teamElement = this.createTeamElement(team);
            teamsGrid.appendChild(teamElement.cloneNode(true));
            
            const tournamentTeamElement = this.createTeamElement(team, true);
            tournamentTeamGrid.appendChild(tournamentTeamElement);
        });
    }

    // Create team element
    createTeamElement(team, isTournament = false) {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-item';
        teamDiv.dataset.teamId = team.id;
        
        teamDiv.innerHTML = `
            <h4>${team.name}</h4>
            <div class="elo-rating">${team.elo}</div>
            <div class="country">${team.country}</div>
        `;

        if (isTournament) {
            teamDiv.addEventListener('click', () => this.toggleTeamSelection(team, teamDiv));
        }

        return teamDiv;
    }

    // Toggle team selection for tournament
    toggleTeamSelection(team, element) {
        const isSelected = element.classList.contains('selected');
        
        if (isSelected) {
            element.classList.remove('selected');
            this.selectedTeams = this.selectedTeams.filter(t => t.id !== team.id);
        } else {
            element.classList.add('selected');
            this.selectedTeams.push(team);
        }

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
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
