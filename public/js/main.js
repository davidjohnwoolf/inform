(function() {

  // menu drop down on click
  var menuIcon = document.getElementById('menu-icon');
  var menu = document.getElementById('menu');

  menu.style.display = 'none';

  menuIcon.addEventListener('click', function() {
    if (menu.style.display === 'none') {
      menu.style.display = 'block';
    } else {
      menu.style.display = 'none';
    }
  });

})();
