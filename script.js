let notes = [];
let currentNoteColor = '#ffffff';
let editingNoteId = "";

const dashboard = document.getElementById('dashboard');


const createNotePlaceholder = document.getElementById('createNotePlaceholder');
const createNoteForm = document.getElementById('createNoteForm');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const cancelNoteBtn = document.getElementById('cancelNoteBtn');
const notesContainer = document.getElementById('notesContainer');
const notesGrid = document.getElementById('notesGrid');


const emptyState = document.getElementById('emptyState');
const colorPicker = document.getElementById('colorPicker');
const createNoteCard = document.getElementById('createNoteCard');


const addImageBtn = document.getElementById('addImageBtn');
const imageInput = document.getElementById('imageInput');
const noteImageContainer = document.getElementById('noteImageContainer');
const noteImage = document.getElementById('noteImage');
const removeImageBtn = document.getElementById('removeImage');


const editNoteModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
const editNoteTitle = document.getElementById('editNoteTitle');
const editNoteContent = document.getElementById('editNoteContent');
const editColorPicker = document.getElementById('editColorPicker');
const updateNoteBtn = document.getElementById('updateNoteBtn');


const editAddImageBtn = document.getElementById('editAddImageBtn');
const editImageInput = document.getElementById('editImageInput');
const editNoteImageContainer = document.getElementById('editNoteImageContainer');
const editNoteImage = document.getElementById('editNoteImage');
const removeEditImageBtn = document.getElementById('removeEditImage');


const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');

const mainContent = document.querySelector('.main-content');


const searchInput = document.getElementById('searchInput');

document.addEventListener('DOMContentLoaded', function () {
  loadNotes();
  setupEventListeners();
});

function loadNotes() {
  notes = JSON.parse(localStorage.getItem('keep_notes') || '[]');
  renderNotes();
}

function saveNotesToStorage() {
  localStorage.setItem('keep_notes', JSON.stringify(notes));
}

function createNote(title, content, color = '#ffffff', image = "") {
  if (!title.trim() && !content.trim() && !image) return;

  const newNote = {
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color,
    image
  };

  notes.unshift(newNote);
  saveNotesToStorage();
  renderNotes();
  resetCreateNoteForm();
}

function updateNote(id, title, content, color, image) {
  const noteIndex = notes.findIndex(note => note.id === id);
  if (noteIndex !== -1) {
    notes[noteIndex] = {
      ...notes[noteIndex],
      title,
      content,
      color,
      image,
      updatedAt: new Date().toISOString()
    };
    saveNotesToStorage();
    renderNotes();
  }
}

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotesToStorage();
  renderNotes();
}

function renderNotes() {
  if (notes.length === 0) {
    emptyState.classList.remove('d-none');
    notesGrid.classList.add('d-none');
  } else {
    emptyState.classList.add('d-none');
    notesGrid.classList.remove('d-none');
    notesGrid.innerHTML = notes.map(note => createNoteHTML(note)).join('');

    notesGrid.onclick = function (e) {
      const card = e.target.closest('.note-card');
      if (!card) return;
      const noteId = card.dataset.noteId;

      if (e.target.closest('.edit-note-btn')) {
        openEditModal(noteId);
        e.stopPropagation();
        return;
      }
      if (e.target.closest('.delete-note-btn')) {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this note?')) {
          deleteNote(noteId);
        }
        return;
      }
      if (!e.target.closest('.note-actions')) {
        openEditModal(noteId);
      }
    };
  }
}

function createNoteHTML(note) {
  return `
    <div class="note-card card mb-3" data-note-id="${note.id}" style="background-color: ${note.color}; cursor: pointer;">
      <div class="card-body">
        ${note.title ? `<h6 class="card-title fw-bold text-dark mb-2">${escapeHtml(note.title)}</h6>` : ''}
        ${note.image ? `<img src="${note.image}" class="img-fluid rounded mb-3" style="max-height: 200px; width: 100%; object-fit: cover;">` : ''}
        ${note.content ? `<p class="card-text text-dark" style="white-space: pre-wrap;">${escapeHtml(note.content)}</p>` : ''}
        <div class="note-actions d-flex gap-2 mt-3">
          <button class="btn btn-sm btn-outline-secondary edit-note-btn">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-sm btn-outline-danger delete-note-btn">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function resetCreateNoteForm() {
  createNoteForm.classList.add('d-none');
  createNotePlaceholder.classList.remove('d-none');
  noteTitle.value = '';
  noteContent.value = '';
  currentNoteColor = '#ffffff';
  createNoteCard.style.backgroundColor = '#ffffff';
  resetImageUpload();
  updateColorPicker(colorPicker, currentNoteColor);
}

function resetImageUpload() {
  imageInput.value = '';
  noteImageContainer.classList.add('d-none');
  noteImage.src = '';
}

function resetEditImageUpload() {
  editImageInput.value = '';
  editNoteImageContainer.classList.add('d-none');
  editNoteImage.src = '';
}

function openEditModal(noteId) {
  const note = notes.find(n => n.id === noteId);
  if (!note) return;

  editingNoteId = noteId;
  editNoteTitle.value = note.title;
  editNoteContent.value = note.content;
  currentNoteColor = note.color;


  document.querySelector('#editNoteModal .modal-content').style.backgroundColor = currentNoteColor;

  if (note.image) {
    editNoteImage.src = note.image;
    editNoteImageContainer.classList.remove('d-none');
    editAddImageBtn.innerHTML = '<i class="fas fa-image me-1"></i>Change Image';
  } else {
    editNoteImageContainer.classList.add('d-none');
    editAddImageBtn.innerHTML = '<i class="fas fa-image me-1"></i>Add Image';
  }

  updateColorPicker(editColorPicker, currentNoteColor);
  editNoteModal.show();
}

function updateColorPicker(picker, selectedColor) {
  picker.querySelectorAll('.color-option').forEach(option => {
    option.classList.toggle('selected', option.dataset.color === selectedColor);
  });
}

function handleImageUpload(input, imageElement, containerElement) {
  const file = input.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageElement.src = e.target.result;
      containerElement.classList.remove('d-none');
    };
    reader.readAsDataURL(file);
  }
}

function setupEventListeners() {
  createNotePlaceholder.addEventListener('click', () => {
    createNotePlaceholder.classList.add('d-none');
    createNoteForm.classList.remove('d-none');
    noteContent.focus();
  });

  saveNoteBtn.addEventListener('click', () => {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    const image = (!noteImageContainer.classList.contains('d-none') && noteImage.src) ? noteImage.src : "";
    createNote(title, content, currentNoteColor, image);
  });

  cancelNoteBtn.addEventListener('click', resetCreateNoteForm);


  colorPicker.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-option')) {
      currentNoteColor = e.target.dataset.color;
      createNoteCard.style.backgroundColor = currentNoteColor;
      updateColorPicker(colorPicker, currentNoteColor);
    }
  });

  editColorPicker.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-option')) {
      currentNoteColor = e.target.dataset.color;
      document.querySelector('#editNoteModal .modal-content').style.backgroundColor = currentNoteColor;
      updateColorPicker(editColorPicker, currentNoteColor);
    }
  });
  // colorPicker.addEventListener('click', (e) => {
  //   if (e.target.classList.contains('color-option')) {
  //     currentNoteColor = e.target.dataset.color;
  //     createNoteCard.style.backgroundColor = currentNoteColor;
  //     updateColorPicker(colorPicker, currentNoteColor);
  //   }
  // });

  // editColorPicker.addEventListener('click', (e) => {
  //   if (e.target.classList.contains('color-option')) {
  //     currentNoteColor = e.target.dataset.color;
  //     document.querySelector('#editNoteModal .modal-content').style.backgroundColor = currentNoteColor;
  //     updateColorPicker(editColorPicker, currentNoteColor);
  //   }
  // });

  addImageBtn.addEventListener('click', () => imageInput.click());
  editAddImageBtn.addEventListener('click', () => editImageInput.click());

  imageInput.addEventListener('change', () => {
    handleImageUpload(imageInput, noteImage, noteImageContainer);
  });

  editImageInput.addEventListener('change', () => {
    handleImageUpload(editImageInput, editNoteImage, editNoteImageContainer);
    editAddImageBtn.innerHTML = '<i class="fas fa-image me-1"></i>Change Image';
  });

  removeImageBtn.addEventListener('click', resetImageUpload);
  removeEditImageBtn.addEventListener('click', resetEditImageUpload);

  updateNoteBtn.addEventListener('click', () => {
    const title = editNoteTitle.value.trim();
    const content = editNoteContent.value.trim();
    const image = (!editNoteImageContainer.classList.contains('d-none') && editNoteImage.src) ? editNoteImage.src : "";
    updateNote(editingNoteId, title, content, currentNoteColor, image);
    editNoteModal.hide();
  });

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-collapsed');
    mainContent.classList.toggle('main-content-expanded');
  });

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredNotes = notes.filter(note =>
      (note.title && note.title.toLowerCase().includes(searchTerm)) ||
      (note.content && note.content.toLowerCase().includes(searchTerm))
    );

    if (filteredNotes.length === 0 && searchTerm) {
      notesGrid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No notes found matching your search.</p></div>';
      notesGrid.classList.remove('d-none');
      emptyState.classList.add('d-none');
    } else if (searchTerm) {
      notesGrid.innerHTML = filteredNotes.map(note => createNoteHTML(note)).join('');
      notesGrid.classList.remove('d-none');
      emptyState.classList.add('d-none');

      notesGrid.onclick = function (e) {
        const card = e.target.closest('.note-card');
        if (!card) return;
        const noteId = card.dataset.noteId;

        if (e.target.closest('.edit-note-btn')) {
          openEditModal(noteId);
          e.stopPropagation();
          return;
        }
        if (e.target.closest('.delete-note-btn')) {
          e.stopPropagation();
          if (confirm('Are you sure you want to delete this note?')) {
            deleteNote(noteId);
          }
          return;
        }
        if (!e.target.closest('.note-actions')) {
          openEditModal(noteId);
        }
      };
    } else {
      renderNotes();
    }
  });

  document.addEventListener('click', (e) => {
    if (!createNoteCard.contains(e.target) && !createNoteForm.classList.contains('d-none')) {
      if (noteTitle.value.trim() || noteContent.value.trim() || (!noteImageContainer.classList.contains('d-none') && noteImage.src)) {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        const image = (!noteImageContainer.classList.contains('d-none') && noteImage.src) ? noteImage.src : "";
        createNote(title, content, currentNoteColor, image);
      } else {
        resetCreateNoteForm();
      }
    }
  });
}