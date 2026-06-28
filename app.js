// =========================
// Load Skills
// =========================

function loadSkills() {


// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });

        // close nav when a link is clicked
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            navLinks.classList.remove('open');
        }));
    }
});
    const container = document.getElementById("skillsContainer");

    container.innerHTML = "";

    const transaction = db.transaction("skills", "readonly");

    const store = transaction.objectStore("skills");

    const request = store.getAll();

    request.onsuccess = function () {

        request.result.forEach(skill => {

            container.innerHTML += `

                <div class="card">

                    <h3>${skill.name}</h3>

                </div>

            `;

        });

        // Add extra skills cards
        container.innerHTML += `
            <div class="card">
                <h3>Graphics Design, Photo Editing, Poster Making</h3>
            </div>
            <div class="card">
                <h3>Github for hosting</h3>
                <p style="font-size:14px; margin-top:10px; color:#555;">Infinity free for hosting both backend and frontend</p>
            </div>
        `;

    };

}

// =========================
// Load Projects
// =========================

function loadProjects() {

    const container = document.getElementById("projectsContainer");

    container.innerHTML = "";

    const transaction = db.transaction("projects", "readonly");

    const store = transaction.objectStore("projects");

    const request = store.getAll();

    request.onsuccess = function () {

        request.result.forEach(project => {

    let badges = "";

    (project.technologies || []).forEach(tech => {
        badges += `<span class="badge">${tech}</span>`;
    });

    const title = project.title ? project.title.toString().trim() : '';
    const titleKey = title.toLowerCase();
    const rawImage = project.image ? project.image.toString().trim().toLowerCase() : '';

    const imageMap = [
        { test: key => key.includes('hostel'), file: 'hostel.png' },
        { test: key => key.includes('vote'), file: 'vote.jpg' },
        { test: key => key.includes('agri'), file: 'agri.png' },
        { test: key => key.includes('ambulance'), file: 'ambulance.png' }
    ];

    const mappedImage = imageMap.find(item => item.test(titleKey));
    let chosenFile = rawImage || (mappedImage ? mappedImage.file : 'profile.png');
    if (chosenFile === 'vote.png') {
        chosenFile = 'vote.jpg';
    }
    if (!['hostel.png','vote.jpg','agri.png','ambulance.png','profile.png'].includes(chosenFile)) {
        chosenFile = mappedImage ? mappedImage.file : 'profile.png';
    }

    const imgSrc = chosenFile;

    console.log('Project image for', title, 'raw:', rawImage, '->', imgSrc);

    const card = document.createElement('div');
    card.className = 'card project-card';

    const img = document.createElement('img');
    img.className = 'project-image';
    img.alt = project.title;

    img.onerror = function () {
        console.warn('Image failed to load:', img.src, 'for project', project.title);
        if (!img.src.endsWith('profile.png')) {
            img.src = 'profile.png';
        }
    };
    img.onload = function () {
        console.log('Loaded image for', project.title, img.src);
    };
    img.src = imgSrc;

    const reportMap = {
        'university hostel booking system': 'hostel-report.html',
        'online voting system': 'vote-report.html',
        'agrinet': 'agri-report.html',
        'ambulance booking system': 'ambulance-report.html'
    };

    const hostedLinksMap = {
        'university hostel booking system': 'https://sandedanieljefferson-prog.github.io/hostel-accommodation/',
        'online voting system': 'https://sandedanieljefferson0-al.github.io/online-voting/',
        'agrinet': '#',
        'ambulance booking system': '#'
    };

    const reportFile = reportMap[title.toLowerCase()] || 'report.html';
    const reportPath = reportFile;
    const hostedLink = hostedLinksMap[title.toLowerCase()] || '#';

    const content = document.createElement('div');
    content.className = 'project-content';

    content.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="badge-container">
            ${badges}
        </div>
        <p class="status">${project.status}</p>
        ${hostedLink !== '#' ? `<p class="visit-link"><a href="${hostedLink}" target="_blank">Tap to visit site</a></p>` : ''}
        <button class="details-btn" type="button">View Details and Project Images</button>
    `;

    const detailsButton = content.querySelector('.details-btn');
    detailsButton.addEventListener('click', () => {
        window.location.href = reportPath;
    });

    card.appendChild(img);
    card.appendChild(content);
    container.appendChild(card);

});

    };

}