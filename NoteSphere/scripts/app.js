// ------------------ STATE ------------------
let currentCategory = "";
let currentSubsection = "";
let currentNoteIndex = null;

// ------------------ DATA ------------------
const notes = JSON.parse(localStorage.getItem("notesData")) || {
    Study: {},
    Professional: {}
};

// ------------------ ELEMENTS ------------------
const categoryButtons = document.querySelectorAll(".category-btn");
const subsectionList = document.getElementById("subsectionList");
const notesList = document.getElementById("notesList");
const textarea = document.querySelector("textarea");
const addNoteBtn = document.getElementById("addNoteBtn");
const themeToggle = document.getElementById("themeToggle");
const addSubsectionBtn = document.getElementById("addSubsectionBtn");
const newSubInput = document.getElementById("newSubInput");

// ------------------ DARK MODE ------------------
themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
};

// ------------------ CATEGORY CLICK ------------------
categoryButtons.forEach(btn => {
    btn.onclick = () => {
        currentCategory = btn.innerText;

        categoryButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        renderSubsections();
        textarea.value = "";
        notesList.innerHTML = "";
    };
});

// ------------------ RENDER SUBSECTIONS ------------------
function renderSubsections() {
    subsectionList.innerHTML = "";

    Object.keys(notes[currentCategory]).forEach(sub => {
        const li = document.createElement("li");
        li.innerText = sub;

        li.onclick = () => {
            currentSubsection = sub;
            document.querySelectorAll(".subsections li")
                .forEach(l => l.classList.remove("active"));
            li.classList.add("active");
            renderNotes();
        };

        subsectionList.appendChild(li);
    });
}

// ------------------ ADD SUBSECTION ------------------
addSubsectionBtn.onclick = () => {
    if (!currentCategory || !newSubInput.value.trim()) return;

    notes[currentCategory][newSubInput.value] = [];
    newSubInput.value = "";

    save();
    renderSubsections();
};

// ------------------ ADD NOTE ------------------
addNoteBtn.onclick = () => {
    if (!currentCategory || !currentSubsection) {
        alert("Select category & subsection first");
        return;
    }

    if (!textarea.value.trim()) return;

    notes[currentCategory][currentSubsection].push(textarea.value);
    alert(`Note added under ${currentSubsection}`);

    textarea.value = "";
    save();
    renderNotes();
};

// ------------------ RENDER NOTES ------------------
function renderNotes() {
    notesList.innerHTML = "";

    notes[currentCategory][currentSubsection].forEach((note, i) => {
        const li = document.createElement("li");
        li.innerText = note.slice(0, 30);

        li.onclick = () => {
            textarea.value = note;
            currentNoteIndex = i;
        };

        const del = document.createElement("span");
        del.innerText = " ❌";
        del.onclick = (e) => {
            e.stopPropagation();
            notes[currentCategory][currentSubsection].splice(i, 1);
            save();
            renderNotes();
            textarea.value = "";
        };

        li.appendChild(del);
        notesList.appendChild(li);
    });
}

// ------------------ SAVE ------------------
function save() {
    localStorage.setItem("notesData", JSON.stringify(notes));
}
