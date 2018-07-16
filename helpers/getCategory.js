function getCategory(category) {
  if (category == 1) { return 'Izin Ketataruangan' }
  else if (category == 2) { return 'Izin Lingkungan' }
  else if (category == 3) { return 'Izin Pembangunan' }
  else if (category == 4) { return 'Izin Kelaikan Fungsi Bangunan' }
  else if (category == 5) { return 'Izin Kelaikan Usaha' }
  else if (category == 6) { return 'Izin Usaha' }
  else if (category == 7) { return 'Izin Kegiatan Badan Usaha' }
  else if (category == 8) { return 'Izin Perorangan (Praktisi/Lisensi)' }
  else if (category == 9) { return 'Izin Kegiatan Perorangan' }
}

module.exports = getCategory;
