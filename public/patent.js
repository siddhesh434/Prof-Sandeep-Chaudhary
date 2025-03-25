document.addEventListener("DOMContentLoaded", function () {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle");

  // Check for saved theme preference or use default (dark)
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Set the toggle position based on the current theme
  themeToggle.checked = savedTheme === "dark";

  // Listen for toggle changes
  themeToggle.addEventListener("change", function (e) {
    if (e.target.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });

  // Patents pagination and search functionality
  initializePatentsSection();

  // Modal functionality
  initializeModal();
});

function initializePatentsSection() {
  // DOM elements
  const entriesSelect = document.getElementById("entries-select-patents");
  const patentSearch = document.getElementById("patent-search");
  const searchBtn = document.getElementById("search-btn-patents");
  const tbody = document.getElementById("patents-body");
  const paginationControls = document.getElementById(
    "pagination-controls-patents"
  );
  const showingStart = document.getElementById("showing-start-patents");
  const showingEnd = document.getElementById("showing-end-patents");
  const totalEntries = document.getElementById("total-entries-patents");

  if (!tbody || !paginationControls) return;

  // Get all rows
  const allRows = tbody.querySelectorAll(".patent-row");

  // Variables
  let currentPage = 1;
  let entriesPerPage = parseInt(entriesSelect ? entriesSelect.value : 10);
  let filteredRows = [...allRows];

  // Initialize pagination
  function initializePagination() {
    updatePagination();
    showPage(currentPage);
  }

  // Update pagination based on filtered rows
  function updatePagination() {
    const pageCount = Math.ceil(filteredRows.length / entriesPerPage);
    paginationControls.innerHTML = "";

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = "&laquo;";
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
        updatePaginationButtons();
      }
    });
    paginationControls.appendChild(prevBtn);

    // Page buttons (show max 5 buttons)
    const maxVisibleButtons = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(pageCount, startPage + maxVisibleButtons - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      pageBtn.dataset.page = i;
      pageBtn.addEventListener("click", () => {
        currentPage = parseInt(i);
        showPage(currentPage);
        updatePaginationButtons();
      });
      paginationControls.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = "&raquo;";
    nextBtn.addEventListener("click", () => {
      if (currentPage < pageCount) {
        currentPage++;
        showPage(currentPage);
        updatePaginationButtons();
      }
    });
    paginationControls.appendChild(nextBtn);

    updatePaginationButtons();
  }

  // Update active button
  function updatePaginationButtons() {
    const buttons = paginationControls.querySelectorAll("button");
    buttons.forEach((button) => {
      if (button.dataset.page == currentPage) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  // Show current page
  function showPage(page) {
    // Hide all rows
    allRows.forEach((row) => {
      row.style.display = "none";
    });

    // Show rows for current page
    const start = (page - 1) * entriesPerPage;
    const end = start + entriesPerPage;

    filteredRows.forEach((row, index) => {
      if (index >= start && index < end) {
        row.style.display = "table-row";
      }
    });

    // Update info text
    if (showingStart && showingEnd && totalEntries) {
      showingStart.textContent = filteredRows.length ? start + 1 : 0;
      showingEnd.textContent = Math.min(end, filteredRows.length);
      totalEntries.textContent = filteredRows.length;
    }
  }

  // Filter rows based on search input
  function filterRows() {
    const searchTerm = patentSearch.value.toLowerCase();
    filteredRows = [...allRows].filter((row) => {
      const text = row.textContent.toLowerCase();
      return text.includes(searchTerm);
    });

    currentPage = 1;
    updatePagination();
    showPage(currentPage);
  }

  // Event listeners
  if (entriesSelect) {
    entriesSelect.addEventListener("change", function () {
      entriesPerPage = parseInt(this.value);
      currentPage = 1;
      updatePagination();
      showPage(currentPage);
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", filterRows);
  }

  if (patentSearch) {
    patentSearch.addEventListener("keyup", function (e) {
      filterRows();
    });
  }

  // Initialize on page load
  initializePagination();
}

function initializeModal() {
  const modal = document.getElementById("patent-modal");
  const closeModal = document.querySelector(".close-modal");
  const viewButtons = document.querySelectorAll(".view-details-btn");

  // Close modal when clicking on X
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // Close modal when clicking outside modal content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Open modal with patent details when View button is clicked
  viewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const patentId = this.getAttribute("data-id");
      const patentRow = document.querySelector(
        `.patent-row[data-index="${patentId}"]`
      );

      if (patentRow) {
        const title = patentRow.children[0].textContent;
        const inventors = patentRow.children[1].textContent;
        const year = patentRow.children[2].textContent;
        const appNumber = patentRow.children[3].textContent;
        const patentNumber = patentRow.children[4].textContent;
        const grantDate = patentRow.children[5].textContent;

        // Set modal content
        document.getElementById("modal-title").textContent = title;
        document.getElementById("modal-inventors").textContent = inventors;
        document.getElementById("modal-year").textContent = year;
        document.getElementById("modal-app-number").textContent = appNumber;
        document.getElementById("modal-patent-number").textContent =
          patentNumber;
        document.getElementById("modal-grant-date").textContent = grantDate;

        // For description, we would typically get this from the database
        // For now, we'll use a placeholder or could add a data attribute to the row
        document.getElementById("modal-description").textContent =
          "This patent describes a novel technology that addresses key challenges in the industry. " +
          "The invention provides significant improvements in efficiency, sustainability, and performance " +
          "compared to existing solutions. This technology has potential applications across multiple sectors " +
          "including research, industry, and consumer products.";

        // Show the modal
        modal.style.display = "block";
      }
    });
  });
}
