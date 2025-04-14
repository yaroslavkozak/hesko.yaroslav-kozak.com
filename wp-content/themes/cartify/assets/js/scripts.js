"use strict";

(function ($) {
  'use strict';

  $(document).ready(function () {
    $.fn.agni_header_sticky = function (offset) {
      var $this = $(this);
      var top = $(document).scrollTop();
      $(window).on('scroll', function () {
        var topOnScroll = $(document).scrollTop();
        topOnScroll > offset ? $this.addClass('stick') : $this.removeClass('stick');

        if ($this.hasClass('style-2')) {
          topOnScroll > top && $this.removeClass('stick');
        }

        top = topOnScroll;
      });
    };

    $('.site-header-sticky').each(function () {
      var offset = $(this).closest('.site-header-container').height();
      $(this).agni_header_sticky(offset);
    });

    $.fn.agni_page_scroll = function () {
      var offsetHeight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
      var $selector = $(this);
      $selector.find('a').on('click', function (e) {
        if ($(this).is('[href*="#"]')) {
          $('html, body').stop().animate({
            scrollTop: offsetHeight ? $(this.hash).offset().top - offsetHeight : $(this.hash).offset().top
          }, duration);
          e.preventDefault();
        }
      });
    };

    $('.page-scroll').each(function () {
      var offsetHeight = $('.site-header-sticky-container').height();
      $(this).agni_page_scroll(offsetHeight, 1000);
    });
    $.agni_scripts = {
      archives_gallery_slider: function archives_gallery_slider($this) {
        $this.slick({
          nextArrow: '<span class="slick-next slick-arrow"><i class="lni lni-chevron-right"></i></span>',
          prevArrow: '<span class="slick-prev slick-arrow"><i class="lni lni-chevron-left"></i></span>',
          rtl: document.dir === 'rtl'
        });
      },
      product_gallery_slider_nav: function product_gallery_slider_nav(product_gallery_slider) {
        var $nav = product_gallery_slider.find('.woocommerce-product-gallery__nav .woocommerce-product-gallery__image');
        $nav.each(function (index, $nav_thumb) {
          if (index == 0) {
            $(this).addClass('active');
          }

          $($nav_thumb).on('click', function () {
            $nav.removeClass('active');
            $(this).addClass('active');
            product_gallery_slider.find('.woocommerce-product-gallery__wrapper').slick('slickGoTo', index);
          });
        });
      },
      product_gallery_slider: function product_gallery_slider($this) {
        var product_gallery_slider_wrapper_class = 'woocommerce-product-gallery__wrapper';
        var product_gallery_slider_nav_class = 'woocommerce-product-gallery__nav';
        var product_gallery_slider = $this.parent('.agni-product-layout-block-images').length !== 0 ? $this.parent('.agni-product-layout-block-images') : $this;
        var product_gallery_slider_wrapper = product_gallery_slider.find('.' + product_gallery_slider_wrapper_class);
        var product_gallery_slider_nav = product_gallery_slider.find('.' + product_gallery_slider_wrapper_class).clone();
        product_gallery_slider_nav.addClass(product_gallery_slider_nav_class).removeClass(product_gallery_slider_wrapper_class);
        product_gallery_slider_nav.find('.has-hoverzoom-lightbox-placeholder').remove();
        var $options = product_gallery_slider.data('slick');

        if (product_gallery_slider_wrapper.children('div:only-child').length !== 0) {
          return null;
        }

        if (product_gallery_slider.hasClass('has-thumbnails')) {
          if (!(product_gallery_slider.hasClass('no-thumbnails-mobile') && window.innerWidth < 667)) {
            var product_gallery_slider_image_id_prefix = 'woocommerce-product-gallery-image';
            $(product_gallery_slider_nav).insertBefore('.' + product_gallery_slider_wrapper_class);

            if (!product_gallery_slider.hasClass('has-slick')) {
              product_gallery_slider_wrapper.find('>div').each(function (index) {
                var main_image = $(this);
                main_image.attr('id', product_gallery_slider_image_id_prefix + index);
              });
              product_gallery_slider_nav.find('>div').each(function (index) {
                var nav_image = $(this);
                nav_image.find('a').attr('href', '#' + product_gallery_slider_image_id_prefix + index);
                nav_image.find('a').on('click', function () {
                  product_gallery_slider_nav.find('>div').removeClass('active');
                  nav_image.addClass('active');
                });
              });
              product_gallery_slider.agni_page_scroll(40, 400);
            }
          }
        }

        if (!product_gallery_slider.hasClass('has-slick')) {
          return null;
        }

        product_gallery_slider.each(function () {
          var $this = $(this);
          $this.on('click', 'a', function (e) {
            e.preventDefault();
          });

          if ($options == null || $options.length <= 0) {
            $options = {
              accessibility: false,
              slidesToScroll: 1,
              slidesToShow: 1,
              infinite: false
            };
          }

          $options['rtl'] = document.dir === 'rtl';
          var $nav_options = {
            slidesToShow: 5,
            focusOnSelect: true,
            infinite: false,
            vertical: false,
            verticalSwiping: false
          };

          if ($this.hasClass('has-vertical-thumbnails') && window.innerWidth > 667) {
            $nav_options['vertical'] = true;
            $nav_options['verticalSwiping'] = true;
          }

          $nav_options['asNavFor'] = '.' + product_gallery_slider_wrapper_class;
          product_gallery_slider_wrapper.slick($options);
          product_gallery_slider_wrapper.on('afterChange', function (event, slick, currentSlide) {
            product_gallery_slider_nav.find('>div').removeClass('active');
            $(product_gallery_slider_nav.find('>div').get(currentSlide)).addClass('active');
          });
          $.agni_scripts.product_gallery_slider_nav(product_gallery_slider);
        });
      }
    };

    $.fn.agni_menu_parent_onclick = function () {};

    $('.has-dropdown-on-click').find('.has-agni-block >a, .menu-item-has-children >a').on('click', function (e) {
      e.preventDefault();
      var $parent = $(this).parent();
      $parent.hasClass('active') ? $parent.removeClass('active') : $parent.addClass('active');
    });
    $('body').on('click', function (e) {
      var $parent = $('.has-agni-block, .menu-item-has-children');

      if (!$parent.is(e.target) && $parent.has(e.target).length === 0) {
        $parent.removeClass('active');
      }
    });
    $('.category-dropdown-menu').each(function () {
      var $dropdown_menu = $(this),
          $dropdown_menu_overlay = $dropdown_menu.find('.category-dropdown-menu__overlay'),
          $dropdown_menu_close = $dropdown_menu.find('.category-dropdown-menu__close');
      $dropdown_menu_close.add($dropdown_menu_overlay).on('click', function () {
        $dropdown_menu.removeClass('active');
      });
    });
    $('.site-header-category-dropdown__toggle').on('click', function () {
      var $dropdown_menu = $(this).siblings('.category-dropdown-menu');
      !$dropdown_menu.hasClass('active') ? $dropdown_menu.addClass('active') : '';
    });
    $('.agni-shop-dock-categories__link:not(.has-custom-link)').on('click', function (e) {
      e.preventDefault();
      var $dropdown_menu = $('.agni-category-dropdown-panel').find('.category-dropdown-menu');
      !$dropdown_menu.hasClass('active') ? $dropdown_menu.addClass('active') : '';
    });
    $('.woocommerce-loop-product__thumbnail').not('.slick-initialized').each(function () {
      var $this = $(this);

      if ($this.hasClass('style-3') && $this.children().length > 1) {
        $.agni_scripts.archives_gallery_slider($this);
      }
    });
    $(document).on('click', '.woocommerce-loop-product__link .slick-arrow', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
    $('.woocommerce-product-gallery').each(function () {
      var $this = $(this);
      $.agni_scripts.product_gallery_slider($this);
    });
    $.agni_header_login_panel = {
      init: function init($this) {
        if ($this.parent().hasClass('logged-in') || $this.parent().hasClass('no-login-form')) {
          return null;
        }

        var $panel = $('.site-header-login-panel');
        $.agni_header_login_panel.show_password($this);
        var $panel_overlay = $panel.find('.site-header-login-panel__overlay');
        var $panel_close = $panel.find('.site-header-login-panel__close');
        $this.on('click', function (e) {
          e.preventDefault();
          $panel.hasClass('active') ? $panel_close.trigger('click') : $panel.addClass('active');
        });
        $panel_close.add($panel_overlay).on('click', function () {
          $panel.removeClass('active');
        });
      },
      show_password: function show_password($this) {
        if ($this.find('.show-password-input').length !== 0) {
          return;
        }

        $this.find('.input-text').each(function () {
          var $input = $(this);

          if ($input.attr('type') === 'password') {
            if ($this.find('.woocommerce-Input[type="password"]').parent('.password-input').length === 0) {
              $this.find('.woocommerce-Input[type="password"]').wrap('<span class="password-input"></span>');
              $this.find('.password-input').append('<span class="show-password-input"></span>');
            }
          }
        });
        $this.find('.show-password-input').click(function () {
          $(this).toggleClass('display-password');

          if ($(this).hasClass('display-password')) {
            $(this).siblings(['input[name^="password"]', 'input[type="password"]']).prop('type', 'text');
          } else {
            $(this).siblings('input[name^="password"]').prop('type', 'password');
          }
        });
      }
    };

    if ($('.site-header-icon-myaccount__link').length > 0) {
      $.agni_header_login_panel.init($('.site-header-icon-myaccount__link'));
    }

    if ($('.agni-shop-dock-myaccount__link:not(.has-custom-link)').length > 0) {
      $.agni_header_login_panel.init($('.agni-shop-dock-myaccount__link'));
    }

    $(".player-yt").each(function () {
      $(this).YTPlayer();
    });
    $(".player-vimeo").each(function () {
      $(this).vimeo_player();
    });

    if ($('.parallax').length > 0) {
      var rellax = new Rellax('.parallax', {});
    }

    $('.agni-slider.slick').each(function () {
      var slideToShowArray = $(this).data('slick-slide-to-show');
      var responsive = [];
      var slidesToShow = '';
      slideToShowArray.forEach(function (value) {
        if (value.breakpoint !== '') {
          responsive.push({
            breakpoint: parseInt(value.breakpoint),
            settings: {
              slidesToShow: parseInt(value.value)
            }
          });
        } else {
          slidesToShow = parseInt(value.value);
        }
      });
      $(this).slick({
        slide: '.agni-slide',
        slidesToShow: slidesToShow,
        responsive: responsive,
        mobileFirst: true,
        nextArrow: '<span class="slick-next slick-arrow"><i class="lni lni-chevron-right"></i></span>',
        prevArrow: '<span class="slick-prev slick-arrow"><i class="lni lni-chevron-left"></i></span>',
        rtl: document.dir === 'rtl'
      });
    });

    $.fn.agni_mobile_menu_accordion = function () {
      var $this = $(this);
      var menu_item = $this.find('.agni-menu-item-more');

      if ($this.hasClass('has-dropdown-on-click')) {
        menu_item = menu_item.add($this.find('.agni-menu-item-container'));
      }

      menu_item.on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var menu_item = $(this).closest('.menu-item');
        var sub_menu = menu_item.children('.sub-menu');

        if (sub_menu.is(':hidden')) {
          sub_menu.slideDown(400);
        } else {
          sub_menu.slideUp(400);
        }
      });
    };

    $('.category-dropdown-menu-nav-menu').each(function () {
      if ($(window).width() < 667) {
        var $this = $(this);
        $this.agni_mobile_menu_accordion();
      }
    });
    $('.agni-slide-video').each(function () {
      var $this = $(this);
      var video = $this.find('video').get(0);

      if (video.paused) {
        $(".agni-slide-video-controls--play").addClass('show');
      } else {
        $(".agni-slide-video-controls--play").addClass('hide');
      }
    });
    $(".agni-slide-video-controls--play").on('click', function () {
      var $this = $(this);
      var video = $this.closest('.agni-slide-video').find('video').get(0);

      if (video.paused) {
        video.play();
        $this.removeClass('show').addClass('hide');
      }
    });

    $.fn.agni_compare_navigation = function ($table) {
      var $this = $(this);
      var scrollMaxLeft = parseInt($table.innerWidth() - $table.parent().innerWidth()) * -1;

      if (scrollMaxLeft != 0) {
        var scrollLeft = function scrollLeft() {
          $table.scrollLeft($table.scrollLeft() - 300);
        };

        var scrollRight = function scrollRight() {
          $table.scrollLeft($table.scrollLeft() + 300);
        };

        var leftTimeout, rightTimeout;
        var nav = $this.find('.agni-compare-nav');
        var left = $this.find('.agni-compare-nav-left');
        var right = $this.find('.agni-compare-nav-right');
        nav.removeClass('hide');

        var scrollStartLeft = function scrollStartLeft(e) {
          var mouseClick = e.which;
          var eventType = e.type;

          if (mouseClick == '1' || eventType == 'touchstart') {
            scrollLeft();
            leftTimeout = setInterval(function () {
              scrollLeft();
            }, 5);
          }

          return false;
        };

        var scrollStartRight = function scrollStartRight(e) {
          var mouseClick = e.which;
          var eventType = e.type;

          if (mouseClick == '1' || eventType == 'touchstart') {
            scrollRight();
            leftTimeout = setInterval(function () {
              scrollRight();
            }, 5);
          }

          return false;
        };

        var scrollStop = function scrollStop() {
          clearInterval(rightTimeout);
          clearInterval(leftTimeout);
          return false;
        };

        left.on('mousedown touchstart', scrollStartLeft);
        right.on('mousedown touchstart', scrollStartRight);
        $(document).on('mouseup', scrollStop);
        right.on('touchend', scrollStop);
        left.on('touchend', scrollStop);
      }
    };

    $('.agni-compare').each(function () {
      var $table = $('.agni-compare__table');
      $(this).agni_compare_navigation($table);
    });

    $.fn.agni_products_aspect_ratio_calc = function () {
      var $this = $(this);
      $this.each(function () {
        var $products = $(this);
        var aspectRatioAttr = $products.attr('data-aspect-ratio');

        if (typeof aspectRatioAttr !== 'undefined') {
          var aspectRatioAttrArray = aspectRatioAttr.split('/');
          var targetChild = $products.find('>li:first-child .woocommerce-loop-product__thumbnail');
          var targetWidth = targetChild.width();
          targetChild.find('img').css({
            'height': Math.round(targetWidth * aspectRatioAttrArray[1] / aspectRatioAttr[0])
          });
        }
      });
    };

    if (!CSS.supports("aspect-ratio", "16/9")) {
      $('.products').agni_products_aspect_ratio_calc();
    }

    if (!CSS.supports("gap", "14px")) {
      console.log("it's gap fallback");
      $('.agni-shop-dock').each(function () {
        var dock_link = $(this).find('a');
        dock_link.css({
          'margin': '-3px 0'
        });
        dock_link.find('>svg, >span').css({
          'margin': '3px 0'
        });
      });
    }
  });
  $(window).on('load', function () {
    $.fn.agni_megamenu_horizontal_alignment = function () {
      var $this = $(this);

      if ($this.find('>.sub-menu').length > 0) {
        var submenus = $this.find('>.sub-menu');
        submenus.each(function () {
          var submenu = $(this);

          if (!submenu.hasClass('has-fullwidth')) {
            var submenuWidth = submenu.width();
            var windowInnerWidth = $(window).width();
            var offsetLeft = document.dir === 'rtl' ? windowInnerWidth - $this.offset().left : $this.offset().left;

            if (windowInnerWidth > submenuWidth) {
              var remainingSpace = windowInnerWidth - offsetLeft;

              if (remainingSpace <= submenuWidth) {
                if (offsetLeft < submenuWidth) {
                  var remainingSpaceLeft = offsetLeft;
                  var halfSubmenuWidth = submenuWidth / 2;

                  if (remainingSpaceLeft < halfSubmenuWidth || remainingSpace < halfSubmenuWidth) {
                    submenu.removeClass('has-align-right').removeClass('has-align-center').addClass('has-fullwidth').addClass('has-fullwidth-onresize');
                  } else {
                    submenu.removeClass('has-align-right').addClass('has-align-center');
                    submenu.get(0).style.setProperty("--cartify_header_submenu_margin_width_offset", Math.round(submenuWidth * -1 / 2) + "px");
                  }
                } else {
                  submenu.removeClass('has-align-center').addClass('has-align-right');

                  if ($this.hasClass('has-agni-block')) {
                    submenu.get(0).style.setProperty("--cartify_header_submenu_margin_width_offset", Math.round($this.width()) + "px");
                  }
                }
              }
            } else {
              submenu.addClass('has-fullwidth');
            }
          }
        });
      }
    };

    $.fn.agni_megamenu_horizontal_alignment_mobile = function () {
      var menu_item = $(this).closest('.menu-item');
      var offsetLeft = menu_item.offset().left;
      var windowInnerWidth = $(window).width();
      var submenu = menu_item.find('>.sub-menu:not(.has-fullwidth)');
      var submenuWidth = submenu.width();
      var submenuPositionOffset = 20;

      if (windowInnerWidth < submenuWidth + offsetLeft) {
        submenu.addClass('has-align-right').removeClass('has-align-left');
        submenu.css({
          'left': submenuPositionOffset,
          'margin-left': offsetLeft - (submenuWidth - menu_item.width())
        });
      } else {
        submenu.addClass('has-align-left').removeClass('has-align-right');
        submenu.css({
          'left': submenuPositionOffset * -1,
          'margin-left': offsetLeft
        });
      }
    };

    $('.site-header-menu').each(function () {
      var $this = $(this);
      var $menu_item = $this.find('.agni-menu-item-more');

      if ($this.hasClass('has-dropdown-on-click')) {
        $menu_item = $menu_item.add($this.find('.agni-menu-item-container'));
      }

      $menu_item.on('click', function () {
        if ($(this).closest('.category-dropdown-menu').length == 0) {
          if ($(window).width() < 667) {
            $(this).agni_megamenu_horizontal_alignment_mobile();
          }
        }
      });
    });
    $('.menu-item').each(function () {
      $(this).agni_megamenu_horizontal_alignment();
    });
    $(window).on('resize', function () {
      $('.menu-item').each(function () {
        $(this).agni_megamenu_horizontal_alignment();
      });
    });

    $.fn.agni_megamenu_vertical_alignment = function () {
      var $this = $(this);

      if ($this.find('>.sub-menu').length > 0) {
        var submenus = $this.find('>.sub-menu');
        submenus.each(function () {
          var submenu = $(this);
          var submenuHeight = submenu.height();
          var remainingSpace = window.innerHeight - $this.offset().top;

          if (remainingSpace <= submenuHeight) {
            if ($this.offset().top < submenuHeight) {
              submenu.addClass('has-align-bottom');
            } else {
              submenu.addClass('has-align-center');
            }
          }
        });
      }
    };

    $('.category-dropdown-menu').each(function () {
      var $this = $(this);
      var isAlignment = $this.hasClass('dropdown-style-1');

      if (isAlignment) {
        $this.find('.menu-item').each(function () {
          var menu_item = $(this);
          menu_item.agni_megamenu_vertical_alignment();
        });
      }
    });
    $('.agni-cookie-consent').each(function () {
      var $this = $(this);
      var cookieConsentName = 'cartify_cookie';

      if (Cookies.get(cookieConsentName) == '1') {
        $this.remove();
      } else {
        $this.addClass('active');
      }
    });
    $(document).on('click', '.agni-cookie-consent__accept', function (e) {
      var $this = $(this);
      var $cookie_wrapper = $this.closest('.agni-cookie-consent');
      var cookieConsentName = 'cartify_cookie';
      var cookieConsentValue = '1';
      var cookieConsentExpires = $this.data('expires');
      var options = {
        path: '/'
      };

      if (cookieConsentExpires !== '') {
        options['expires'] = cookieConsentExpires / 24;
      }

      Cookies.set(cookieConsentName, cookieConsentValue, options);
      $cookie_wrapper.remove();
    });
    $(document).on('click', '.agni-cookie-consent__close', function () {
      var $cookie_wrapper = $(this).closest('.agni-cookie-consent');
      $cookie_wrapper.remove();
    });
  });
})(jQuery);