function getRole(level) {
  if (level == 0) {
    return 'Superadmin'
  } else if (level == 1) {
    return 'Admin'
  } else if (level == 2) {
    return 'Mitra Jasa'
  } else if (level == 3) {
    return 'Mitra Jasa VIP'
  } else if (level == 4) {
    return 'Pencari Jasa'
  } else if (level == 5) {
    return 'Pencari Jasa VIP'
  }
}

module.exports = getRole;
