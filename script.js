document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const homeLink = document.getElementById('home-link');
    const categoryOverviewSection = document.getElementById('category-overview');
    const itemListSection = document.getElementById('item-list');
    const leaderboardSection = document.getElementById('leaderboard');

    showDefaultView();

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            displayItems(category);
            categoryOverviewSection.innerHTML = ''; 
            leaderboardSection.innerHTML = ''; 
        });
    });

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showDefaultView();
        itemListSection.innerHTML = ''; 
        leaderboardSection.innerHTML = ''; 
    });

    function showDefaultView() {
        let overviewHTML = '';
        for (const category in data) {
            overviewHTML += `
                <h2 data-category="${category}">
                    <img src="images/${category.toLowerCase()}.png" alt="${category} Icon">
                    ${category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                <table>
                    <tr>
                        <th>Item</th>
                        <th>#1 Player</th>
                        <!-- Removed the Items Collected/XP Collected column from the main page -->
                    </tr>
            `;
            data[category].items.forEach(item => {
                const topPlayer = data[category].leaderboards[item][0]; 
                overviewHTML += `
                    <tr>
                        <td data-category="${category}" data-item="${item}">
                            <img src="images/${item.toLowerCase()}.png" alt="${item} Icon">
                            ${item}
                        </td>
                        <td>${topPlayer.player || 'Unknown'}</td>
                        <!-- Removed the quantity column from the main page -->
                    </tr>
                `;
            });
            overviewHTML += '</table>';
        }
        categoryOverviewSection.innerHTML = overviewHTML;

        const categoryHeaders = categoryOverviewSection.querySelectorAll('h2');
        categoryHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                const category = header.dataset.category;
                displayItems(category);
                categoryOverviewSection.innerHTML = ''; 
                leaderboardSection.innerHTML = ''; 
            });
        });

        const itemCells = categoryOverviewSection.querySelectorAll('td[data-item]');
        itemCells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                e.preventDefault();
                const category = cell.dataset.category;
                const item = cell.dataset.item;
                displayItems(category); 
                displayLeaderboard(category, item); 
                categoryOverviewSection.innerHTML = ''; 

                const itemButtons = itemListSection.querySelectorAll('button');
                itemButtons.forEach(btn => btn.classList.remove('selected')); 
                const selectedButton = itemListSection.querySelector(`button[data-item="${item}"]`);
                if (selectedButton) {
                    selectedButton.classList.add('selected'); 
                }
            });
        });
    }

    function displayItems(category) {
    const items = data[category].items;
    itemListSection.innerHTML = `
        <h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
        <ul>
            ${items.map(item => `
                <li>
                    <button data-category="${category}" data-item="${item}">
                        <img src="images/${item.toLowerCase()}.png" alt="${item} Icon">
                        ${item}
                    </button>
                </li>
            `).join('')}
        </ul>
    `;

    const itemButtons = itemListSection.querySelectorAll('button');
    itemButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const category = button.dataset.category;
            const item = button.dataset.item;

            itemButtons.forEach(btn => btn.classList.remove('selected'));

            button.classList.add('selected');
            displayLeaderboard(category, item);

            if (window.innerWidth <= 768) {
                leaderboardSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

    function displayLeaderboard(category, item) {
        const leaderboard = data[category].leaderboards[item];
        let table = `
            <table>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>${category === 'slayer' ? 'XP Collected' : 'Items Collected'}</th>
                    <th>Date Submitted</th>  <!-- Keeping Date Submitted in detailed tables -->
                </tr>
        `;
        leaderboard.forEach(entry => {
            const rankClass = entry.rank === 1 ? 'rank1' : entry.rank === 2 ? 'rank2' : entry.rank === 3 ? 'rank3' : '';
            table += `
                <tr class="${rankClass}">
                    <td>${entry.rank}</td>
                    <td>${entry.player || 'Unknown'}</td>
                    <td>${entry.quantity || ''}</td>
                    <td>${entry.date || 'N/A'}</td>  <!-- Keeping date in detailed tables -->
                </tr>
            `;
        });
        table += '</table>';
        leaderboardSection.innerHTML = `
            <h3>${item} Leaderboard</h3>
            ${table}
            <p class="note">Note: All collections listed are approximate due to submission dates.</p>
        `;
    }
});
