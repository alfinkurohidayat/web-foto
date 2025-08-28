fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const categoryGrid = document.getElementById('category-grid');
    const photoGrid = document.getElementById('photo-grid');
    const photosTitle = document.getElementById('photos-title');

    // Modal elements
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.getElementById('close-btn');
    const detailImage = document.getElementById('detail-image');
    const downloadBtn = document.getElementById('download-btn');

    // 🔹 Balik urutan data (entry terakhir jadi pertama)
    const reversedData = [...data].reverse();

    // Ambil semua kategori unik + "All"
    const categories = ["All", ...new Set(data.map(item => item.category))];

    // Render semua foto
    function renderAllPhotos() {
      photosTitle.textContent = "Semua Foto";
      photoGrid.innerHTML = '';

      reversedData.forEach(item => {
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        img.classList.add('photo-item');

        // prevent klik kanan & drag
        img.setAttribute("draggable", "false");
        img.setAttribute("oncontextmenu", "return false;");

        img.addEventListener('click', () => showDetail(item));
        photoGrid.appendChild(img);
      });
    }

    // Render berdasarkan kategori
    function renderCategoryPhotos(category) {
      if (category === "All") {
        renderAllPhotos();
        return;
      }

      photosTitle.textContent = `Foto kategori: ${category}`;
      photoGrid.innerHTML = '';

      reversedData
        .filter(item => item.category === category)
        .forEach(item => {
          const img = document.createElement('img');
          img.src = item.image;
          img.alt = item.title;
          img.classList.add('photo-item');

          img.setAttribute("draggable", "false");
          img.setAttribute("oncontextmenu", "return false;");

          img.addEventListener('click', () => showDetail(item));
          photoGrid.appendChild(img);
        });
    }

    // Tampilkan detail modal
    function showDetail(item) {
      detailImage.src = item.image;
      downloadBtn.href = item.image;
      downloadBtn.setAttribute("download", item.title + ".jpg");
      modal.style.display = "flex";
    }

    // Close modal
    closeBtn.addEventListener('click', () => {
      modal.style.display = "none";
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    // Render kategori + fungsi active
    categories.forEach(cat => {
      const div = document.createElement('div');
      div.classList.add('category-item');
      div.innerHTML = `<p>${cat}</p>`;

      div.addEventListener('click', () => {
        // hapus semua active
        document.querySelectorAll('.category-item').forEach(c => c.classList.remove('active'));
        // set active ke kategori yg diklik
        div.classList.add('active');
        renderCategoryPhotos(cat);
      });

      categoryGrid.appendChild(div);
    });

    // Default: aktifkan kategori "All"
    const allCategory = categoryGrid.querySelector('.category-item:first-child');
    if (allCategory) {
      allCategory.classList.add('active');
    }

    // Load pertama -> semua foto
    renderAllPhotos();
  })
  .catch(error => console.error('Error load data:', error));
