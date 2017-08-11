window.authorize = function (URISuccess) {
  console.log('asd');
  var username = document.getElementById('username').value;
  var newLocation = '/authorize' + window.location.search;
  if (window.location.search) {
    newLocation += '&';
  } else {
    newLocation += '?';
  }
  window.location = URISuccess;
};