let menuLists = $('.footer-nav-list-item.level-1');

if ($(window).width() < 344) {
    menuLists.each(function () {
        const menu = $(this),
        menuHeading = menu.find('.footer-nav-link-title'),
        menuList = menu.find('.footer-nav-list.level-2');
        
        menuHeading.on('click', function () {
            menu.toggleClass('collapsible-closed')
        })
    })
 }

