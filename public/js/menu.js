(function() {

  // menu drop down on click
  var header = document.getElementById('header-wrap');
  var menuIcon = document.getElementById('menu-icon');
  var menu = document.getElementById('menu');
  var content = document.getElementById('content-wrap');

  menu.style.display = 'none';
  content.style.marginTop = header.offsetHeight + 10 + 'px';

  menuIcon.addEventListener('click', function() {
    if (menu.style.display === 'none') {
      menu.style.display = 'block';
      content.style.marginTop = header.offsetHeight + 10 + 'px';
    } else {
      menu.style.display = 'none';
      content.style.marginTop = header.offsetHeight + 10 + 'px';
    }
  });

})();
