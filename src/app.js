import '../style.css';
import './components.js';
import Swal from 'sweetalert2';
import {
  fetchActiveNotes,
  fetchArchivedNotes,
  createNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
} from './api.js';

class NotesApp {
  constructor() {
    this.notes = [];
    this.currentFilter = 'all';

    this.sidebar = document.querySelector('app-sidebar');
    this.appBar = document.querySelector('app-bar');
    this.noteList = document.querySelector('note-list');
    this.noteInput = document.querySelector('note-input');
    this.loadingIndicator = document.querySelector('loading-indicator');
    this.statTotal = document.querySelector('#statTotalNotes');
    this.statActive = document.querySelector('#statActiveNotes');
    this.statArchived = document.querySelector('#statArchivedNotes');
    this.sectionTitle = document.querySelector('#sectionTitle');
    this.sectionBadge = document.querySelector('#sectionBadge');
    this.addNoteHeroBtn = document.querySelector('#addNoteHeroBtn');

    this.init();
  }

  init() {
    this.setupListeners();
    this.loadNotes();
  }

  setLoading(isLoading, message = 'Memuat data...') {
    if (this.loadingIndicator) {
      if (isLoading) {
        this.loadingIndicator.show(message);
      } else {
        this.loadingIndicator.hide();
      }
    }
  }

  async loadNotes() {
    this.setLoading(true, 'Mengambil data catatan...');
    try {
      const [activeNotes, archivedNotes] = await Promise.all([
        fetchActiveNotes(),
        fetchArchivedNotes(),
      ]);

      const combinedNotes = [...activeNotes, ...archivedNotes];
      combinedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      this.notes = combinedNotes;
      this.updateUI();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Catatan',
        text: error.message || 'Terjadi kendala saat mengambil data dari server.',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      this.setLoading(false);
    }
  }

  setupListeners() {
    // Tambah Catatan dari <note-input>
    document.addEventListener('add-note', async (e) => {
      const { title, body } = e.detail;
      this.setLoading(true, 'Menyimpan catatan baru...');

      try {
        await createNote({ title, body });
        if (this.noteInput && typeof this.noteInput.resetForm === 'function') {
          this.noteInput.resetForm();
        }

        await this.loadNotes();

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Catatan baru telah berhasil disimpan.',
          timer: 1800,
          showConfirmButton: false,
        });

        if (this.noteList) {
          this.noteList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menambah Catatan',
          text: error.message || 'Tidak dapat menyimpan catatan ke server.',
          confirmButtonColor: '#3b82f6',
        });
      } finally {
        this.setLoading(false);
      }
    });

    // Toggle Arsip dari <note-item>
    document.addEventListener('toggle-archive-note', async (e) => {
      const { id, nextState } = e.detail;
      const loadingMessage = nextState
        ? 'Mengarsipkan catatan...'
        : 'Mengembalikan catatan ke aktif...';

      this.setLoading(true, loadingMessage);

      try {
        if (nextState) {
          await archiveNote(id);
        } else {
          await unarchiveNote(id);
        }

        await this.loadNotes();

        Swal.fire({
          icon: 'success',
          title: 'Status Diperbarui',
          text: nextState
            ? 'Catatan berhasil diarsipkan.'
            : 'Catatan dipindahkan kembali ke aktif.',
          timer: 1600,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memperbarui Status',
          text: error.message || 'Terjadi kesalahan saat memperbarui status arsip.',
          confirmButtonColor: '#3b82f6',
        });
      } finally {
        this.setLoading(false);
      }
    });

    // Hapus Catatan dari <note-item>
    document.addEventListener('delete-note', async (e) => {
      const { id, title } = e.detail;

      const confirmResult = await Swal.fire({
        title: 'Hapus Catatan?',
        text: `Apakah Anda yakin ingin menghapus "${title}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
      });

      if (!confirmResult.isConfirmed) return;

      this.setLoading(true, 'Menghapus catatan dari server...');

      try {
        await deleteNote(id);
        await this.loadNotes();

        Swal.fire({
          icon: 'success',
          title: 'Catatan Terhapus',
          text: 'Catatan berhasil dihapus.',
          timer: 1600,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus Catatan',
          text: error.message || 'Tidak dapat menghapus catatan dari server.',
          confirmButtonColor: '#3b82f6',
        });
      } finally {
        this.setLoading(false);
      }
    });

    // Filter Kategori dari <app-sidebar>
    document.addEventListener('filter-change', (e) => {
      const { filter } = e.detail;
      this.currentFilter = filter;
      if (this.noteList) {
        this.noteList.setAttribute('filter', filter);
      }
      this.updateSectionHeader();
    });

    // Pencarian Catatan dari <app-bar>
    document.addEventListener('search-notes', (e) => {
      const { query } = e.detail;
      if (this.noteList) {
        this.noteList.setAttribute('search-query', query);
      }
    });

    // Toggle Drawer Mobile
    document.addEventListener('toggle-sidebar', () => {
      if (this.sidebar) {
        this.sidebar.toggleMobileSidebar();
      }
    });

    // Tombol Scroll ke Form Tambah
    if (this.addNoteHeroBtn && this.noteInput) {
      this.addNoteHeroBtn.addEventListener('click', () => {
        this.noteInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const titleInput = this.noteInput.querySelector('#noteTitle');
        if (titleInput) {
          setTimeout(() => titleInput.focus(), 300);
        }
      });
    }
  }

  updateSectionHeader() {
    if (!this.sectionTitle || !this.sectionBadge) return;

    const countAll = this.notes.length;
    const countActive = this.notes.filter((n) => !n.archived).length;
    const countArchived = this.notes.filter((n) => n.archived).length;

    if (this.currentFilter === 'all') {
      this.sectionTitle.textContent = 'Semua Catatan';
      this.sectionBadge.textContent = `${countAll} Total`;
    } else if (this.currentFilter === 'active') {
      this.sectionTitle.textContent = 'Catatan Aktif';
      this.sectionBadge.textContent = `${countActive} Aktif`;
    } else if (this.currentFilter === 'archived') {
      this.sectionTitle.textContent = 'Catatan Diarsipkan';
      this.sectionBadge.textContent = `${countArchived} Arsip`;
    }
  }

  updateUI() {
    const totalCount = this.notes.length;
    const activeCount = this.notes.filter((n) => !n.archived).length;
    const archivedCount = this.notes.filter((n) => n.archived).length;

    if (this.statTotal) this.statTotal.textContent = totalCount;
    if (this.statActive) this.statActive.textContent = activeCount;
    if (this.statArchived) this.statArchived.textContent = archivedCount;

    if (this.sidebar) {
      this.sidebar.setAttribute('count-all', totalCount);
      this.sidebar.setAttribute('count-active', activeCount);
      this.sidebar.setAttribute('count-archived', archivedCount);
    }

    if (this.noteList) {
      this.noteList.notes = this.notes;
    }

    this.updateSectionHeader();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new NotesApp();
});
