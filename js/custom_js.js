$(function () {

    window.addEventListener('scroll', function (e) {
        console.log('scrolled');
        //Define objects for classie or other js/jquery to work with.
        //Only use selectors that will return single objects. If an array of objects is
        //returned then messy things happens.
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            shrinkOn = 300,
            header = document.querySelector("header"),
            slogan = document.querySelector(".slogan"),
            menu = document.querySelector("ng-md-icon[icon=menu]"),
            custom_filter = document.querySelector('#custom_filter');
        //            about_us = document.querySelector("#block_about_us"),  //Looked stupid
        //            header_video = document.querySelector("#header_video");  //Looked stupid

        //START ebug messages:
        console.log('ElementTop: ' + ($(custom_filter).offset().top - 50));
        console.log('WindowTop: ' + this.pageYOffset);
        //        console.log('AnchorTop: ' + ngreset[0].offsetTop);
        //        console.log('Distance to trigger: ' + (custom_filter.prop('offsetTop') - (this.pageYOffset + ngresult[0].offsetHeight)));
        //END ebug messages:

        if (distanceY > 0) {
            //We are at the top of the screen so show everything as expanded (Need to make sure media queries account for mobile displays)

            classie.add(header, "smaller");
            classie.add(slogan, "smaller");
            classie.add(menu, "show");
            //            classie.add(about_us, "hide");
            //            classie.add(header_video, "show");
        } else {
            //We are at the top of the screen so show everything as expanded (Need to make sure media queries account for mobile displays)

            if (classie.has(header, "smaller")) {
                classie.remove(header, "smaller");
                classie.remove(slogan, "smaller");
                classie.remove(menu, "show");
                //                classie.remove(about_us, "hide");
                //                classie.remove(header_video, "hide");

            }
        }

        if (classie.has(custom_filter, "fixed-top") && this.pageYOffset <= 100) {
            classie.remove(custom_filter, 'fixed-top');
            console.log('Bring it back');
        } else if (this.pageYOffset + 50 > $(custom_filter).offset().top) {
            classie.add(custom_filter, 'fixed-top');
            //            var offset = ((ngresult[0].offsetHeight - element.prop('offsetHeight')) / 2);
            //            console.log(offset);
            //            element.css('top', offset.toString() + 'px');
            //            element.addClass('col-md-5');
            //            element.addClass('navbar-fixed-top');
            console.log('Item is out of view.');
        } else {
            classie.remove(custom_filter, 'fixed-top');
            console.log('Item is in view.');
        }
    });

    $("[data-toggle='tooltip']").tooltip();
});