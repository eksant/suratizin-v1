'use strict';

exports.null = function () {
  return null
}

exports.success = function(text) {
  return {
    msg   : text || 'The record has been successfully updated.',
    type  : 'success',
  }
}

exports.error = function(err) {
  return {
    msg   : err,
    type  : 'danger',
  }
}
