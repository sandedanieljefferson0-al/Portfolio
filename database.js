// =====================================
// Portfolio IndexedDB
// =====================================

const DB_NAME = "PortfolioDB";
const DB_VERSION = 6;

let db;

const request = indexedDB.open(DB_NAME, DB_VERSION);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (db.objectStoreNames.contains("skills")) {
        db.deleteObjectStore("skills");
    }
    if (db.objectStoreNames.contains("projects")) {
        db.deleteObjectStore("projects");
    }

    const skillStore = db.createObjectStore("skills", {
        keyPath: "id",
        autoIncrement: true
    });

    skillStore.add({ name: "HTML5" });
    skillStore.add({ name: "CSS3" });
    skillStore.add({ name: "JavaScript" });
    skillStore.add({ name: "PHP" });
    skillStore.add({ name: "Python" });
    skillStore.add({ name: "MySQLworkbench,xampp and wamp and database programming" });
    skillStore.add({ name: "java1" });
    skillStore.add({ name: "Personal Skills: Communication, Presenting, Group Work, Problem Solving, Teamwork, Leadership, Critical Thinking, Time Management" });

    const projectStore = db.createObjectStore("projects", {
        keyPath: "id",
        autoIncrement: true
    });

    projectStore.add({
        title: "university hostel booking system",
        description: "A complete web-based application for booking, paying hostels",
        image: "hostel.png",
        technologies: ["HTML", "CSS", "JavaScript", "MySQL"],
        status: "Completed"
    });

    projectStore.add({
        title: "online voting system",
        description: "An online voting web application that allows voting online from different places and different intervals",
        image: "vote.jpg",
        technologies: ["HTML", "CSS", "JavaScript", "Indexed database"],
        status: "Completed"
    });

    projectStore.add({
        title: "Agrinet",
        description: "A web application to enhance agriculture in the Kigezi region which i did as my final year project with other four coursemets",
        image: "agri.png",
        technologies: ["HTML", "Python", "Node.js", "React", "MySQL Workbench"],
        status: "In Progress"
    });

    projectStore.add({
        title: "Ambulance booking system",
        description: "A web application to help book ambulances for future appointments",
        image: "ambulance.png",
        technologies: ["HTML", "CSS", "JavaScript", "IndexedDB"],
        status: "Under development"
    });
};

request.onsuccess = function (event) {
    db = event.target.result;

    const expectedProjects = [
        {
            title: "university hostel booking system",
            description: "A complete web-based application for booking, paying hostels",
            image: "hostel.png",
            technologies: ["HTML", "CSS", "JavaScript", "MySQL"],
            status: "Completed"
        },
        {
            title: "online voting system",
            description: "An online voting web application that allows voting online from different places and different intervals",
            image: "vote.jpg",
            technologies: ["HTML", "CSS", "JavaScript", "Indexed database"],
            status: "Completed"
        },
        {
            title: "Agrinet",
            description: "A web application to enhance agriculture in the Kigezi region which i did as my final year project with other four coursemets",
            image: "agri.png",
            technologies: ["HTML", "Python", "Node.js", "React", "MySQL Workbench"],
            status: "In Progress"
        },
        {
            title: "Ambulance booking system",
            description: "A web application to help book ambulances for future appointments",
            image: "ambulance.png",
            technologies: ["HTML", "CSS", "JavaScript", "IndexedDB"],
            status: "Under development"
        }
    ];

    const tx = db.transaction("projects", "readwrite");
    const store = tx.objectStore("projects");
    const getAllReq = store.getAll();

    getAllReq.onsuccess = function () {
        const projects = getAllReq.result || [];
        const updates = [];

        expectedProjects.forEach(expected => {
            const existing = projects.find(project => project.title && project.title.toString().trim().toLowerCase() === expected.title.toLowerCase());
            if (!existing) {
                updates.push(expected);
                return;
            }

            const existingDescription = existing.description ? existing.description.toString().trim() : "";
            const expectedDescription = expected.description.toString().trim();
            const existingImage = existing.image ? existing.image.toString().trim() : "";
            const existingStatus = existing.status ? existing.status.toString().trim() : "";
            const existingTech = Array.isArray(existing.technologies) ? existing.technologies.map(t => t.toString().trim()) : [];
            const expectedTech = expected.technologies;

            if (
                existingDescription !== expectedDescription ||
                existingImage !== expected.image ||
                existingStatus !== expected.status ||
                JSON.stringify(existingTech) !== JSON.stringify(expectedTech)
            ) {
                existing.description = expectedDescription;
                existing.image = expected.image;
                existing.status = expected.status;
                existing.technologies = expectedTech;
                updates.push(existing);
            }
        });

        if (updates.length > 0) {
            const writeTx = db.transaction("projects", "readwrite");
            const writeStore = writeTx.objectStore("projects");
            updates.forEach(project => writeStore.put(project));

            writeTx.oncomplete = function () {
                loadSkills();
                loadProjects();
            };

            writeTx.onerror = function () {
                loadSkills();
                loadProjects();
            };
        } else {
            loadSkills();
            loadProjects();
        }
    };

    getAllReq.onerror = function () {
        loadSkills();
        loadProjects();
    };
};

request.onerror = function () {
    console.log("Database failed to open.");
};