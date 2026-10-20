import anime from 'animejs';

// Helper: format tanggal Indonesia
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper: sanitasi XSS
const escapeHtml = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/* -------------------------------------------------------------
   1. <app-bar>: Header & Bar Pencarian
   ------------------------------------------------------------- */
class AppBar extends HTMLElement {
  static get observedAttributes() {
    return ['title'];
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      const titleEl = this.querySelector('.brand-title');
      if (titleEl) titleEl.textContent = newValue;
    }
  }

  setupListeners() {
    const searchInput = this.querySelector('#searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        this.dispatchEvent(
          new CustomEvent('search-notes', {
            detail: { query: event.target.value.trim() },
            bubbles: true,
          })
        );
      });

      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }

    const menuToggle = this.querySelector('#menuToggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('toggle-sidebar', { bubbles: true }));
      });
    }
  }

  render() {
    this.innerHTML = `
      <div class="header-content">
        <div class="header-left">
          <button id="menuToggle" class="menu-toggle-btn" aria-label="Toggle menu" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div class="header-search">
            <span class="search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input 
              type="text" 
              id="searchInput" 
              placeholder="Cari catatan..." 
              autocomplete="off" 
              aria-label="Cari judul catatan"
            />
            <span class="search-shortcut">Ctrl+F</span>
          </div>
        </div>

        <div class="header-right">
          <div class="user-profile">
            <div class="avatar">DA</div>
            <div class="user-info">
              <span class="user-name">Dimas Academy</span>
              <span class="user-role">Front-End Student</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

/* -------------------------------------------------------------
   2. <app-sidebar>: Navigasi Status Catatan
   ------------------------------------------------------------- */
class AppSidebar extends HTMLElement {
  static get observedAttributes() {
    return ['active-filter', 'count-all', 'count-active', 'count-archived'];
  }

  constructor() {
    super();
    this._isOpen = false;
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'active-filter') {
        this.updateActiveItem(newValue);
      } else if (name.startsWith('count-')) {
        this.updateBadgeCounts();
      }
    }
  }

  setupListeners() {
    this.addEventListener('click', (e) => {
      const item = e.target.closest('.nav-item');
      if (!item) return;

      const filter = item.dataset.filter;
      if (filter) {
        this.setAttribute('active-filter', filter);
        this.dispatchEvent(
          new CustomEvent('filter-change', {
            detail: { filter },
            bubbles: true,
          })
        );

        if (window.innerWidth <= 992) {
          this.toggleMobileSidebar(false);
        }
      }
    });

    const backdrop = this.querySelector('.sidebar-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        this.toggleMobileSidebar(false);
      });
    }
  }

  toggleMobileSidebar(forceState) {
    this._isOpen = typeof forceState === 'boolean' ? forceState : !this._isOpen;
    const sidebar = this.querySelector('.sidebar-aside');
    const backdrop = this.querySelector('.sidebar-backdrop');
    if (sidebar && backdrop) {
      sidebar.classList.toggle('open', this._isOpen);
      backdrop.classList.toggle('visible', this._isOpen);
    }
  }

  updateActiveItem(activeFilter) {
    const items = this.querySelectorAll('.nav-item');
    items.forEach((item) => {
      item.classList.toggle('active', item.dataset.filter === activeFilter);
    });
  }

  updateBadgeCounts() {
    const bAll = this.querySelector('#badge-all');
    const bActive = this.querySelector('#badge-active');
    const bArchived = this.querySelector('#badge-archived');

    if (bAll) bAll.textContent = this.getAttribute('count-all') || '0';
    if (bActive) bActive.textContent = this.getAttribute('count-active') || '0';
    if (bArchived) bArchived.textContent = this.getAttribute('count-archived') || '0';
  }

  render() {
    const activeFilter = this.getAttribute('active-filter') || 'all';
    const countAll = this.getAttribute('count-all') || '0';
    const countActive = this.getAttribute('count-active') || '0';
    const countArchived = this.getAttribute('count-archived') || '0';

    this.innerHTML = `
      <div class="sidebar-backdrop"></div>
      <aside class="sidebar-aside">
        <div class="brand-section">
          <div class="brand-logo-icon">N</div>
          <span class="brand-title">Notespace</span>
        </div>

        <div class="nav-group">
          <span class="nav-label">Navigasi Catatan</span>
          <ul class="nav-list">
            <li class="nav-item ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">
              <div class="nav-item-content">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <span>Semua Catatan</span>
              </div>
              <span class="nav-badge" id="badge-all">${countAll}</span>
            </li>
            <li class="nav-item ${activeFilter === 'active' ? 'active' : ''}" data-filter="active">
              <div class="nav-item-content">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span>Catatan Aktif</span>
              </div>
              <span class="nav-badge" id="badge-active">${countActive}</span>
            </li>
            <li class="nav-item ${activeFilter === 'archived' ? 'active' : ''}" data-filter="archived">
              <div class="nav-item-content">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="21 8 21 21 3 21 3 8"></polyline>
                  <rect x="1" y="3" width="22" height="5"></rect>
                  <line x1="10" y1="12" x2="14" y2="12"></line>
                </svg>
                <span>Arsip</span>
              </div>
              <span class="nav-badge" id="badge-archived">${countArchived}</span>
            </li>
          </ul>
        </div>

        <div class="sidebar-footer">
          <div class="app-status">
            <span>Notes App v2.0 - RESTful API</span>
          </div>
        </div>
      </aside>
    `;
  }
}

/* -------------------------------------------------------------
   3. <note-input>: Formulir Tambah Catatan & Realtime Validation
   ------------------------------------------------------------- */
class NoteInput extends HTMLElement {
  static get observedAttributes() {
    return ['max-length'];
  }

  constructor() {
    super();
    this.maxTitleLength = 50;
    this.isTitleTouched = false;
    this.isBodyTouched = false;
  }

  connectedCallback() {
    if (this.hasAttribute('max-length')) {
      const parsed = parseInt(this.getAttribute('max-length'), 10);
      if (!isNaN(parsed) && parsed > 0) this.maxTitleLength = parsed;
    }
    this.render();
    this.setupListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'max-length' && oldValue !== newValue) {
      const parsed = parseInt(newValue, 10);
      if (!isNaN(parsed) && parsed > 0) {
        this.maxTitleLength = parsed;
        this.updateCharCounter();
      }
    }
  }

  setupListeners() {
    const form = this.querySelector('#noteForm');
    const titleInput = this.querySelector('#noteTitle');
    const bodyInput = this.querySelector('#noteBody');

    if (!form || !titleInput || !bodyInput) return;

    // Realtime Title Validation
    titleInput.addEventListener('input', () => {
      this.isTitleTouched = true;
      if (titleInput.value.length > this.maxTitleLength) {
        titleInput.value = titleInput.value.slice(0, this.maxTitleLength);
      }
      this.updateCharCounter();
      this.validateInputs();
    });

    titleInput.addEventListener('blur', () => {
      this.isTitleTouched = true;
      this.validateInputs();
    });

    // Realtime Body Validation
    bodyInput.addEventListener('input', () => {
      this.isBodyTouched = true;
      this.validateInputs();
    });

    bodyInput.addEventListener('blur', () => {
      this.isBodyTouched = true;
      this.validateInputs();
    });

    // Submit Handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.isTitleTouched = true;
      this.isBodyTouched = true;

      if (!this.validateInputs()) return;

      this.dispatchEvent(
        new CustomEvent('add-note', {
          detail: {
            title: titleInput.value.trim(),
            body: bodyInput.value.trim(),
          },
          bubbles: true,
        })
      );
    });

    this.updateCharCounter();
    this.validateInputs();
  }

  resetForm() {
    const form = this.querySelector('#noteForm');
    if (form) form.reset();
    this.isTitleTouched = false;
    this.isBodyTouched = false;
    this.updateCharCounter();
    this.validateInputs();
  }

  updateCharCounter() {
    const titleInput = this.querySelector('#noteTitle');
    const charCounter = this.querySelector('#charCounter');
    if (!titleInput || !charCounter) return;

    const remaining = this.maxTitleLength - titleInput.value.length;
    charCounter.textContent = `Sisa karakter: ${remaining}`;
    charCounter.classList.remove('limit-warning', 'limit-danger');

    if (remaining <= 5) {
      charCounter.classList.add('limit-danger');
    } else if (remaining <= 15) {
      charCounter.classList.add('limit-warning');
    }
  }

  validateInputs() {
    const titleInput = this.querySelector('#noteTitle');
    const bodyInput = this.querySelector('#noteBody');
    const titleError = this.querySelector('#titleError');
    const bodyError = this.querySelector('#bodyError');
    const submitBtn = this.querySelector('#submitBtn');

    if (!titleInput || !bodyInput) return false;

    let isTitleValid = true;
    let isBodyValid = true;

    const titleValue = titleInput.value.trim();
    const bodyValue = bodyInput.value.trim();

    if (!titleValue) {
      isTitleValid = false;
      if (titleError) titleError.textContent = 'Judul catatan tidak boleh kosong.';
    } else if (titleValue.length < 3) {
      isTitleValid = false;
      if (titleError) titleError.textContent = 'Judul catatan minimal 3 karakter.';
    } else {
      if (titleError) titleError.textContent = '';
    }

    if (!bodyValue) {
      isBodyValid = false;
      if (bodyError) bodyError.textContent = 'Isi catatan tidak boleh kosong.';
    } else if (bodyValue.length < 5) {
      isBodyValid = false;
      if (bodyError) bodyError.textContent = 'Isi catatan minimal 5 karakter.';
    } else {
      if (bodyError) bodyError.textContent = '';
    }

    if (this.isTitleTouched) {
      titleInput.classList.toggle('is-invalid', !isTitleValid);
      titleError?.classList.toggle('visible', !isTitleValid);
    }

    if (this.isBodyTouched) {
      bodyInput.classList.toggle('is-invalid', !isBodyValid);
      bodyError?.classList.toggle('visible', !isBodyValid);
    }

    const isFormValid = isTitleValid && isBodyValid;
    if (submitBtn) submitBtn.disabled = !isFormValid;
    return isFormValid;
  }

  render() {
    this.innerHTML = `
      <div class="form-card">
        <div class="form-card-header">
          <h3>Tambah Catatan Baru</h3>
          <span class="char-limit" id="charCounter">Sisa karakter: ${this.maxTitleLength}</span>
        </div>

        <form id="noteForm" novalidate>
          <div class="form-group">
            <label for="noteTitle">Judul Catatan</label>
            <input 
              type="text" 
              id="noteTitle" 
              class="form-input" 
              placeholder="Masukkan judul catatan..." 
              maxlength="${this.maxTitleLength}"
              required 
              autocomplete="off"
            />
            <span class="form-error-message" id="titleError" role="alert"></span>
          </div>

          <div class="form-group">
            <label for="noteBody">Isi Catatan</label>
            <textarea 
              id="noteBody" 
              class="form-textarea" 
              placeholder="Tuliskan detail catatan Anda di sini..." 
              required
            ></textarea>
            <span class="form-error-message" id="bodyError" role="alert"></span>
          </div>

          <div class="form-actions">
            <button type="submit" id="submitBtn" class="btn-primary" disabled>
              <span>+ Buat Catatan</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

/* -------------------------------------------------------------
   4. <note-item>: Kartu Catatan dengan Custom Attributes
   ------------------------------------------------------------- */
class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['note-id', 'note-title', 'note-body', 'created-at', 'archived'];
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.querySelector('.card-inner')) {
      this.updateContent(name, newValue);
    }
  }

  updateContent(name, value) {
    if (name === 'note-title') {
      const el = this.querySelector('.card-title');
      if (el) el.textContent = value;
    } else if (name === 'note-body') {
      const el = this.querySelector('.card-body');
      if (el) el.textContent = value;
    } else if (name === 'created-at') {
      const el = this.querySelector('.card-date span');
      if (el) el.textContent = formatDate(value);
    } else if (name === 'archived') {
      const isArchived = value === 'true';
      const badge = this.querySelector('.card-badge');
      const toggleBtn = this.querySelector('.btn-toggle-archive');

      if (badge) {
        badge.textContent = isArchived ? 'Diarsipkan' : 'Aktif';
        badge.className = `card-badge ${isArchived ? 'badge-archived' : 'badge-active'}`;
      }
      if (toggleBtn) {
        toggleBtn.textContent = isArchived ? 'Pindahkan ke Aktif' : 'Arsipkan';
      }
    }
  }

  setupListeners() {
    const toggleArchiveBtn = this.querySelector('.btn-toggle-archive');
    const deleteBtn = this.querySelector('.btn-delete');

    if (toggleArchiveBtn) {
      toggleArchiveBtn.addEventListener('click', () => {
        const id = this.getAttribute('note-id');
        const isArchived = this.getAttribute('archived') === 'true';
        this.dispatchEvent(
          new CustomEvent('toggle-archive-note', {
            detail: { id, nextState: !isArchived },
            bubbles: true,
          })
        );
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        const id = this.getAttribute('note-id');
        const title = this.getAttribute('note-title') || 'catatan ini';
        this.dispatchEvent(
          new CustomEvent('delete-note', {
            detail: { id, title },
            bubbles: true,
          })
        );
      });
    }
  }

  render() {
    const id = this.getAttribute('note-id') || '';
    const title = this.getAttribute('note-title') || 'Tanpa Judul';
    const body = this.getAttribute('note-body') || '';
    const createdAt = this.getAttribute('created-at') || new Date().toISOString();
    const isArchived = this.getAttribute('archived') === 'true';

    this.innerHTML = `
      <div class="card-inner" data-id="${escapeHtml(id)}">
        <div class="card-top">
          <div class="card-header">
            <h3 class="card-title">${escapeHtml(title)}</h3>
            <span class="card-badge ${isArchived ? 'badge-archived' : 'badge-active'}">
              ${isArchived ? 'Diarsipkan' : 'Aktif'}
            </span>
          </div>

          <div class="card-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${formatDate(createdAt)}</span>
          </div>

          <div class="card-body">${escapeHtml(body)}</div>
        </div>

        <div class="card-footer">
          <button type="button" class="card-btn btn-toggle-archive" aria-label="Toggle archive">
            ${isArchived ? 'Pindahkan ke Aktif' : 'Arsipkan'}
          </button>
          <button type="button" class="card-btn btn-delete" aria-label="Hapus catatan">
            Hapus
          </button>
        </div>
      </div>
    `;
  }
}

/* -------------------------------------------------------------
   5. <note-list>: Penampung Daftar Catatan Berbasis CSS Grid
   ------------------------------------------------------------- */
class NoteList extends HTMLElement {
  static get observedAttributes() {
    return ['filter', 'search-query'];
  }

  constructor() {
    super();
    this._notes = [];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  set notes(data) {
    this._notes = Array.isArray(data) ? data : [];
    this.render();
  }

  get notes() {
    return this._notes;
  }

  getFilteredNotes() {
    const filter = this.getAttribute('filter') || 'all';
    const searchQuery = (this.getAttribute('search-query') || '').trim().toLowerCase();

    return this._notes.filter((note) => {
      if (filter === 'active' && note.archived) return false;
      if (filter === 'archived' && !note.archived) return false;
      if (searchQuery && !note.title.toLowerCase().includes(searchQuery)) return false;
      return true;
    });
  }

  render() {
    const filteredNotes = this.getFilteredNotes();
    this.innerHTML = `<div class="notes-grid" id="notesGrid"></div>`;
    const grid = this.querySelector('#notesGrid');

    if (filteredNotes.length === 0) {
      const filter = this.getAttribute('filter') || 'all';
      const searchQuery = (this.getAttribute('search-query') || '').trim();

      let message = 'Belum ada catatan di bagian ini.';
      if (searchQuery) {
        message = `Tidak ada catatan dengan judul "${searchQuery}".`;
      } else if (filter === 'archived') {
        message = 'Belum ada catatan yang diarsipkan.';
      } else if (filter === 'active') {
        message = 'Tidak ada catatan aktif. Buat catatan baru sekarang!';
      }

      grid.innerHTML = `
        <div class="empty-state">
          <h3>Catatan Tidak Ditemukan</h3>
          <p>${message}</p>
        </div>
      `;
      return;
    }

    filteredNotes.forEach((note) => {
      const item = document.createElement('note-item');
      item.setAttribute('note-id', note.id);
      item.setAttribute('note-title', note.title);
      item.setAttribute('note-body', note.body);
      item.setAttribute('created-at', note.createdAt);
      item.setAttribute('archived', String(Boolean(note.archived)));
      grid.appendChild(item);
    });

    if (anime && filteredNotes.length > 0) {
      anime({
        targets: grid.querySelectorAll('.card-inner'),
        translateY: [16, 0],
        opacity: [0, 1],
        delay: anime.stagger(30),
        duration: 350,
        easing: 'easeOutQuad',
      });
    }
  }
}

/* -------------------------------------------------------------
   6. <loading-indicator>: Indikator Loading Saat Request HTTP
   ------------------------------------------------------------- */
class LoadingIndicator extends HTMLElement {
  static get observedAttributes() {
    return ['loading', 'message'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.updateState();
    }
  }

  updateState() {
    const isLoading = this.getAttribute('loading') === 'true';
    const message = this.getAttribute('message') || 'Memuat data...';
    const overlay = this.querySelector('.loading-overlay');
    const textEl = this.querySelector('.loading-text');

    if (overlay) {
      overlay.classList.toggle('active', isLoading);
      overlay.setAttribute('aria-hidden', String(!isLoading));
    }
    if (textEl) {
      textEl.textContent = message;
    }
  }

  show(message = 'Memuat data...') {
    this.setAttribute('message', message);
    this.setAttribute('loading', 'true');
  }

  hide() {
    this.setAttribute('loading', 'false');
  }

  render() {
    const isLoading = this.getAttribute('loading') === 'true';
    const message = this.getAttribute('message') || 'Memuat data...';

    this.innerHTML = `
      <div class="loading-overlay ${isLoading ? 'active' : ''}" role="status" aria-live="polite" aria-hidden="${!isLoading}">
        <div class="loading-spinner-box">
          <div class="loading-spinner"></div>
          <span class="loading-text">${escapeHtml(message)}</span>
        </div>
      </div>
    `;
  }
}

// Registrasi seluruh Custom Elements
customElements.define('app-bar', AppBar);
customElements.define('app-sidebar', AppSidebar);
customElements.define('note-input', NoteInput);
customElements.define('note-item', NoteItem);
customElements.define('note-list', NoteList);
customElements.define('loading-indicator', LoadingIndicator);

export { AppBar, AppSidebar, NoteInput, NoteItem, NoteList, LoadingIndicator };
