"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function ($) {
  'use strict';

  $(function () {
    $('.lost_reset_password, .woocommerce-form-login, .woocommerce-form-register').each(function () {
      var $form_fields = $('.woocommerce-form-row');
      $form_fields.each(function () {
        var $form_field = $(this);
        $form_field.find('input').on('input', function () {
          var $label = $form_field.find('label');
          $(this).val() == '' ? $label.removeClass('hide') : $label.addClass('hide');
        });
      });
    });
    $(document).on('click', '.qty-plus, .qty-minus', function () {
      var $qty = $(this).closest('.quantity').find('.qty'),
          currentVal = parseFloat($qty.val()),
          max = parseFloat($qty.attr('max')),
          min = parseFloat($qty.attr('min')),
          step = $qty.attr('step');
      if (!currentVal || currentVal === '' || currentVal === 'NaN') currentVal = 0;
      if (max === '' || max === 'NaN') max = '';
      if (min === '' || min === 'NaN') min = 0;
      if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN') step = 1;

      if ($(this).is('.qty-plus')) {
        if (max && (max == currentVal || currentVal > max)) {
          $qty.val(max);
        } else {
          $qty.val(currentVal + parseFloat(step));
        }
      } else {
        if (min && (min == currentVal || currentVal < min)) {
          $qty.val(min);
        } else if (currentVal > 0) {
          $qty.val(currentVal - parseFloat(step));
        }
      }

      $qty.trigger('change');
    });
    $(document).on('change', '.woocommerce-cart-form input.qty, .woocommerce-cart-form select.qty', function () {
      var form = $(this).closest('.woocommerce-cart-form'),
          update_cart_btn = form.find('button[name=update_cart]');
      update_cart_btn.prop('disabled', false);
      update_cart_btn.trigger('click');
    });
    var wc_checkout_coupons = {
      init: function init() {
        $('form.checkout_coupon').submit(this.submit);
      },
      submit: function submit() {
        var $form = $(this);

        if ($form.is('.processing')) {
          return false;
        }

        $form.addClass('processing').block({
          message: null,
          overlayCSS: {
            background: '#fff',
            opacity: 0.6
          }
        });
        var data = {
          security: wc_checkout_params.apply_coupon_nonce,
          coupon_code: $form.find('input[name="coupon_code"]').val()
        };
        $.ajax({
          type: 'POST',
          url: wc_checkout_params.wc_ajax_url.toString().replace('%%endpoint%%', 'apply_coupon'),
          data: data,
          success: function success(code) {
            $('.woocommerce-error, .woocommerce-message').remove();
            $form.removeClass('processing').unblock();

            if (code) {
              $form.before(code);
              $(document.body).trigger('update_checkout', {
                update_shipping_method: false
              });
            }
          },
          dataType: 'html'
        });
        return false;
      }
    };
    $('form.checkout').on('change', function () {
      wc_checkout_coupons.init();
    });
    $('body').on('click', ".coupon_submit", function (e) {
      e.preventDefault();
      var $coupon = $(this).closest('.agni_checkout_coupon');
      var data = {
        security: wc_checkout_params.apply_coupon_nonce,
        coupon_code: $(this).siblings('input[name="coupon_code"]').val()
      };
      $.ajax({
        type: 'POST',
        url: wc_checkout_params.wc_ajax_url.toString().replace('%%endpoint%%', 'apply_coupon'),
        data: data,
        success: function success(code) {
          if (code) {
            $coupon.before(code);
            $(document.body).trigger('update_checkout', {
              update_shipping_method: false
            });
          }
        },
        dataType: 'html'
      });
    });

    $.agni_scroll_navigation = function ($content, $nav) {
      var $table = $content;
      var $tableInnerWidth = $table.innerWidth();
      var $tableParentInnerWidth = $table.parent().innerWidth();
      var scrollMaxLeft = parseInt($tableInnerWidth - $tableParentInnerWidth) * -1;
      var leftTimeout, rightTimeout;
      var left = $nav.find('.nav-left');
      var right = $nav.find('.nav-right');
      $nav.removeClass('hide');

      function scrollLeft() {
        $table.scrollLeft($table.scrollLeft() - 300);
      }

      function scrollRight() {
        $table.scrollLeft($table.scrollLeft() + 300);
      }

      var scrollStartLeft = function scrollStartLeft(e) {
        var mouseClick = e.which;
        var eventType = e.type;

        if (mouseClick == '1' || eventType == 'touchstart') {
          scrollLeft();
        }

        return false;
      };

      var scrollStartRight = function scrollStartRight(e) {
        var mouseClick = e.which;
        var eventType = e.type;

        if (mouseClick == '1' || eventType == 'touchstart') {
          scrollRight();
        }

        return false;
      };

      var scrollStop = function scrollStop(e) {
        clearInterval(rightTimeout);
        clearInterval(leftTimeout);
        return false;
      };

      left.on('mousedown touchstart', scrollStartLeft);
      right.on('mousedown touchstart', scrollStartRight);
      $(document).on('mouseup', scrollStop);
      right.on('touchend', scrollStop);
      left.on('touchend', scrollStop);
    };

    $('.agni-shop-categories-bar').each(function () {
      var $this = $(this);

      if ($this.hasClass('has-scroll-navigation')) {
        var $content = $this.find('.agni-shop-categories-bar__list');
        var $table = $this.find('.agni-shop-categories-bar__container');
        var $nav = $this.find('.agni-shop-categories-bar-nav');
        $.agni_scroll_navigation($table, $nav);
      }
    });
    $('.site-header-menu').each(function () {
      var $this = $(this);

      if ($this.hasClass('has-scroll-navigation')) {
        var $content = $this.find('.site-header-menu-contents');
        var $nav = $this.find('.site-header-menu-nav');
        $.agni_scroll_navigation($content, $nav);
      }
    });

    $.agni_product_layout_inline_products_carousel = function ($this) {
      var slickOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var breakpoints = cartify_woocommerce.breakpoints;
      var options = {
        dots: false,
        speed: 300,
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '20px',
        nextArrow: '<span class="slick-next slick-arrow"><i class="lni lni-chevron-right"></i></span>',
        prevArrow: '<span class="slick-prev slick-arrow"><i class="lni lni-chevron-left"></i></span>',
        rtl: document.dir === 'rtl'
      };
      options = $.extend(options, slickOptions);
      Object.entries(breakpoints).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            device = _ref2[0],
            value = _ref2[1];

        if (device == 'tab') {
          if ($(window).width() < parseInt(value)) {
            $this.slick(options);
          }
        }
      });
    };

    $('.agni-product-layout-block').each(function () {
      var isAllowedBlock = $(this).hasClass('has-inline-products') && ($(this).hasClass('agni-product-layout-block-related') || $(this).hasClass('agni-product-layout-block-upsell') || $(this).hasClass('agni-product-layout-block-recently_viewed'));
      var options = {};
      var products = $(this).find('ul.products');

      if ($(this).hasClass('agni-product-layout-block-recently_viewed')) {
        options = {
          slidesToShow: 4,
          slidesToScroll: 2
        };

        if ($(products.children()).length < 4) {
          isAllowedBlock = false;
        }
      }

      if (isAllowedBlock) {
        $.agni_product_layout_inline_products_carousel(products, options);
      }
    });
    $.agni_woocommerce_product_archive_thumbnail_slider = {
      init: function init($this) {
        var variation_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var thumbnails_container = $this.closest('li.product').find('.woocommerce-loop-product__thumbnail'),
            action = 'agni_template_loop_add_to_cart_reset';
        var loading_variation_text = 'Loading',
            loader_append_class = 'woocommerce-loop-product';
        var product_data = {
          security: cartify_woocommerce.security,
          product_id: $this.closest('li.product').find('.variations_form').data('product_id')
        };

        if (variation_id) {
          product_data['variation_id'] = variation_id;
          product_data['product_id'] = $this.data('product_id');
          action = 'agni_template_loop_add_to_cart';
        }

        $.agni_additional_variation_images.product_gallery_loader_show(thumbnails_container, loader_append_class, loading_variation_text);
        $.ajax({
          url: cartify_woocommerce.ajaxurl_wc.toString().replace('%%endpoint%%', action),
          type: 'POST',
          data: product_data,
          success: function success(response) {
            if (!response) {
              return false;
            }

            thumbnails_container.replaceWith(response);
            var new_thumbnails_container = $this.closest('li.product').find('.woocommerce-loop-product__thumbnail');
            new_thumbnails_container.not('.slick-initialized').each(function () {
              var $this = $(this);

              if ($this.hasClass('style-3') && $this.children().length > 1) {
                $.agni_scripts.archives_gallery_slider($this);
              }
            });
            $.agni_additional_variation_images.product_gallery_loader_hide(new_thumbnails_container);
          }
        });
      },
      reset: function reset($this, callback) {
        $.agni_woocommerce_product_archive_thumbnail_slider.init($this);

        if (callback) {
          callback();
        }
      }
    };
    $(document).on("show_variation", ".products form.variations_form", function (event, variation) {
      var $this = $(this);
      $this.find('.woocommerce-variation').html('');
      $.agni_woocommerce_product_archive_thumbnail_slider.init($this, variation['variation_id']);
    });
    $(document).on('click', '.products form.variations_form .reset_variations', function () {
      var $this = $(this);
      $.agni_woocommerce_product_archive_thumbnail_slider.reset($this);
    });
    $(document).on('change.wc-variation-form', function () {
      var $attributes = $('.variations').find('.value');
      $('.variations_form').each(function () {
        var variation_form = $(this);
        variation_form.find('.value').each(function () {
          var $value = $(this);
          var enabled_attributes = [];
          $value.each(function () {
            $(this).find('option').each(function () {
              var $this = $(this);

              if ($this.val().length !== 0) {
                enabled_attributes.push($this.val());
              }
            });
            var $swatches = $(this).find('.agni-swatch');
            $swatches.addClass('disabled');
            $swatches.each(function () {
              for (var i = 0; i < enabled_attributes.length; i++) {
                if ($(this).data('value') == enabled_attributes[i]) {
                  $(this).removeClass('disabled');
                  break;
                }
              }
            });
          });
        });
      });
    });
    $('.agni-woocommerce-pagination:not(.has-ajax)').on('keyup', 'input[type="number"]', function (e) {
      var $this = $(this),
          new_page_num = $this.val();
      var href = window.location.href;
      var url_match_page = href.match(/([a-z]+.)\/[0-9]/g);
      var url_match_paged = href.match(/(paged=)+[0-9]/g);
      var new_page_url = href;

      if (url_match_page) {
        new_page_url = href.replace(/([a-z]+.)\/[0-9]/g, "$1" + '/' + new_page_num);
      } else if (url_match_paged) {
        new_page_url = href.replace(/(paged=)+[0-9]/g, "$1" + new_page_num);
      } else {
        if (new_page_num > 1) {
          var url = new URL(href);
          url.pathname = url.pathname + 'page/' + new_page_num + '/';
          new_page_url = url;
        }
      }

      if (e.key === "Enter") {
        window.location.href = new_page_url;
      }
    });
    $.single_buynow_button = {
      init: function init($this) {
        var $form = $this.closest('.entry-summary').find('.variations_form.cart'),
            $add_to_cart_redirect = $form.parent().hasClass('has-cart-redirect'),
            buynow = true;
        $form.on('hide_variation', function () {
          $this.removeClass('wc-variation-is-unavailable').addClass('disabled wc-variation-selection-needed');
        });
        $form.on('show_variation', function () {
          $this.removeClass('disabled wc-variation-selection-needed wc-variation-is-unavailable');
        });
        $this.on('click', function (e) {
          if ($add_to_cart_redirect) {
            return null;
          }

          e.preventDefault();
          $.single_buynow_button.click(buynow, $this);
        });
      },
      click: function click(buynow, $this) {
        if ($this.is('.disabled')) {
          if ($this.is('.wc-variation-is-unavailable')) {
            window.alert(wc_add_to_cart_variation_params.i18n_unavailable_text);
          } else if ($this.is('.wc-variation-selection-needed')) {
            window.alert(wc_add_to_cart_variation_params.i18n_make_a_selection_text);
          }
        } else {
          $this.closest('.entry-summary').find('form.cart button[type="submit"]').trigger('submit', [buynow]);
        }
      }
    };
    $.single_buynow_button.init($('.single_buynow_button'));
    $.agni_woocommerce_qty_update_cart = {
      init: function init($this, choice) {
        var qty_sib = $this.siblings('.add_to_cart_button');
        var qty = parseInt(qty_sib.attr('data-quantity'));
        var input_min = $this.find('input').attr('min');
        var input_max = $this.find('input').attr('max');
        var product_id = $this.data('product_id');
        $this.on('click', '.qty-plus, .qty-minus', function () {
          var qty_ele = $(this);

          if (choice == '2') {
            if (qty_ele.hasClass('qty-plus')) {
              qty += 1;
            }

            if (qty_ele.hasClass('qty-minus') && input_min < qty) {
              qty -= 1;
            }

            qty_sib.attr('data-quantity', qty);
          }

          if (choice == '1') {
            $.ajax({
              url: cartify_ajax_sidecart.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_ajax_get_cart_item_key'),
              type: 'POST',
              data: {
                'product_id': product_id
              },
              success: function success(res) {
                var new_cart_key = res.key;
                var qty = parseInt(res.qty);

                if (qty_ele.hasClass('qty-plus')) {
                  qty += 1;
                }

                if (qty_ele.hasClass('qty-minus')) {
                  if (qty == 1) {
                    $this.removeClass('active');
                  }

                  qty -= 1;
                }

                $.update_cart(new_cart_key, qty);
              }
            });
          }
        });
      }
    };
    $('.products').each(function () {
      var products = $(this);
      products.find('.agni-update-cart').each(function () {
        if (products.hasClass('has-qty-2')) {
          $.agni_woocommerce_qty_update_cart.init($(this), '2');
        }

        if (products.hasClass('has-qty-1')) {
          $.agni_woocommerce_qty_update_cart.init($(this), '1');
        }
      });
    });
    $.agni_woocommerce_product_easyzoom = {
      init: function init($this) {
        if ($this.find('.easyzoom').length > 0) {
          var $easyzoom = $this.find('.easyzoom').easyZoom({
            preventClicks: false,
            loadingNotice: '',
            errorNotice: ''
          });
          var $easyzoom_api = $easyzoom.data('easyZoom');
          $('form.variations_form').on('show_variation', function () {
            $easyzoom_api.teardown();

            $easyzoom_api._init();
          });
        }
      },
      insert_class: function insert_class($this) {
        $this.find('.woocommerce-product-gallery__image').addClass('easyzoom easyzoom--overlay easyzoom--with-thumbnails');
      }
    };

    $.fn.is_product_gallery_feature_active = function (classPrefix) {
      var $this = $(this);
      var devicesList = [{
        device: 'desktop',
        value: {
          min: 1440,
          max: ''
        }
      }, {
        device: 'laptop',
        value: {
          min: 1024,
          max: 1439
        }
      }, {
        device: 'tab',
        value: {
          min: 667,
          max: 1023
        }
      }, {
        device: 'mobile',
        value: {
          min: '',
          max: 666
        }
      }];
      var isHoverZoom = false;
      devicesList.forEach(function (device) {
        var deviceName = device.device;
        var value = device.value;

        if ($this.hasClass(classPrefix + '-' + deviceName)) {
          var isMin = value.min ? window.innerWidth >= value.min : true;
          var isMax = value.max ? window.innerWidth < value.max : true;

          if (isMin && isMax) {
            isHoverZoom = true;
          }
        }
      });
      return isHoverZoom;
    };

    $('.woocommerce-product-gallery').each(function () {
      var $this = $(this);
      var product_gallery_slider = $this.parent('.agni-product-layout-block-images').length !== 0 ? $this.parent('.agni-product-layout-block-images') : $this;
      var product_gallery_wrapper = $this.find('.woocommerce-product-gallery__wrapper');

      if (product_gallery_slider.is_product_gallery_feature_active('has-hoverzoom')) {
        $.agni_woocommerce_product_easyzoom.insert_class(product_gallery_wrapper);
        $.agni_woocommerce_product_easyzoom.init($this);
      }
    });
    $.agni_woocommerce_product_photoswipe = {
      product_gallery_lightbox: function product_gallery_lightbox($this) {
        $this.photoswipeimage({
          getThumbBoundsFn: function getThumbBoundsFn() {
            return false;
          },
          bgOpacity: 1,
          loop: true,
          shareEl: false
        });
        $this.find('a').prepend('<div class="has-hoverzoom-lightbox-placeholder"></div>');
      },
      product_html_lightbox: function product_html_lightbox($this) {
        $this.photoswipehtml();
      },
      photoswipe_wrapper: function photoswipe_wrapper() {
        if ($('body').find('.pswp').length !== 0) {
          return null;
        }

        var $pswp_wrapper = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar pswp--svg"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"> </button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"> </button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>';
        $('body').append($pswp_wrapper);
      }
    };
    $('.woocommerce-product-gallery').each(function () {
      var $this = $(this);
      var product_gallery_slider = $this.parent('.agni-product-layout-block-images').length !== 0 ? $this.parent('.agni-product-layout-block-images') : $this;
      var product_gallery_wrapper = $this.find('.woocommerce-product-gallery__wrapper');

      if (product_gallery_slider.is_product_gallery_feature_active('has-lightbox')) {
        $.agni_woocommerce_product_photoswipe.photoswipe_wrapper();
        $.agni_woocommerce_product_photoswipe.product_gallery_lightbox(product_gallery_wrapper);
      }
    });
    $('.agni-threesixty').each(function () {
      var $this = $(this);
      var threeSixtyContainer = $('.threesixty-container'),
          threeSixtyNav = $('.agni-threesixty__nav'),
          threeSixtyOptions = threeSixtyContainer.data('360');
      $this.on('click', '.agni-threesixty__button', function (e) {
        e.preventDefault();
        !$this.hasClass('active') ? $this.addClass('active') : $this.removeClass('active');
        var threeSixtySlider = threeSixtyContainer.ThreeSixty({
          totalFrames: threeSixtyOptions.count,
          endFrame: threeSixtyOptions.count,
          currentFrame: 1,
          imgArray: threeSixtyOptions.src,
          imgList: '.threesixty_images',
          progress: '.agni-threesixty__loader',
          ext: threeSixtyOptions.extension,
          height: threeSixtyOptions.height,
          width: threeSixtyOptions.width,
          navigation: false,
          disableSpin: false
        });
        threeSixtyNav.on('click', '.agni-threesixty__nav--prev', function () {
          threeSixtySlider.previous();
        });
        threeSixtyNav.on('click', '.agni-threesixty__nav--next', function () {
          threeSixtySlider.next();
        });
        threeSixtyNav.on('click', '.agni-threesixty__nav--play', function () {
          threeSixtySlider.play();
          $(this).addClass('hide');
          $this.find('.agni-threesixty__nav--stop').removeClass('hide');
        });
        threeSixtyNav.on('click', '.agni-threesixty__nav--stop', function () {
          threeSixtySlider.stop();
          $(this).addClass('hide');
          $this.find('.agni-threesixty__nav--play').removeClass('hide');
        });
      });
      $this.on('click', '.agni-threesixty__close, .agni-threesixty__overlay', function (e) {
        e.preventDefault();
        $this.removeClass('active');
      });
    });
    $('.agni-product-video').each(function () {
      var $this = $(this);
      var button = $this.find('.agni-product-video__button');
      $.agni_woocommerce_product_photoswipe.photoswipe_wrapper();
      $.agni_woocommerce_product_photoswipe.product_html_lightbox(button);
    });
    $.agni_sale_countdown = {
      init: function init($this) {
        var startdate = new Date(Date.parse(new Date($this.data('countdown-startdate') * 1000))),
            enddate = new Date(Date.parse(new Date($this.data('countdown-enddate') * 1000)));

        if (startdate > new Date() || enddate <= new Date()) {
          return false;
        }

        $.agni_sale_countdown.countdown($this, startdate, enddate);
      },
      getTimeRemaining: function getTimeRemaining(enddate) {
        var t = Date.parse(enddate) - Date.parse(new Date()),
            seconds = Math.floor(t / 1000 % 60),
            minutes = Math.floor(t / 1000 / 60 % 60),
            hours = Math.floor(t / (1000 * 60 * 60) % 24),
            days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
          'total': t,
          'days': days,
          'hours': hours,
          'minutes': minutes,
          'seconds': seconds
        };
      },
      countdown: function countdown($this, startdate, enddate) {
        function updateClock() {
          var t = $.agni_sale_countdown.getTimeRemaining(enddate),
              html = '';
          var percentage = (Date.parse(enddate) - Date.parse(new Date())) * 100 / (Date.parse(enddate) - Date.parse(startdate));
          var percentage_trim = percentage.toFixed(2);
          var stroke_offset = 57 - 57 * percentage_trim / 100;
          $this.find('.days').html(t.days);
          $this.find('.hours').html(('0' + t.hours).slice(-2));
          $this.find('.minutes').html(('0' + t.minutes).slice(-2));
          $this.find('.seconds').html(('0' + t.seconds).slice(-2));
          $this.find('svg circle:nth-child(2)').css({
            'stroke-dashoffset': stroke_offset
          });

          if (t.total <= 0) {
            clearInterval(timeinterval);
          }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);
      }
    };
    $('.agni-sale-countdown').each(function () {
      $.agni_sale_countdown.init($(this));
    });
    $('.agni-slide-countdown').each(function () {
      $.agni_sale_countdown.init($(this));
    });
    $('.shop-single-page-container .product-type-variable form.variations_form').on('show_variation', function (event, variation) {
      var $this = $(this),
          variation_id = variation.variation_id;
      var product_data = {};

      if (variation_id) {
        product_data['variation_id'] = variation_id;
      }

      $.ajax({
        url: cartify_woocommerce.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_woocommerce_sale_countdown'),
        type: 'POST',
        data: product_data,
        success: function success(response) {
          if (!response) {
            return false;
          }

          $this.closest('.entry-summary').append(response);
          $this.siblings('.agni-sale-countdown').insertAfter($this.siblings('.price'));
          $.agni_sale_countdown.init($this.siblings('.agni-sale-countdown'));
        }
      });
    });
    $('.shop-single-page-container .product-type-variable form.variations_form').on('click', '.reset_variations', function () {
      $(this).parents('form.variations_form').siblings('.agni-sale-countdown').remove();
    });

    $.agni_woocommerce_myaccount_toggle = function ($this) {
      var custom_login = $('#customer_login');
      var custom_login_divs = custom_login.find('>div');
      var toggle_divs = $this.find('>div');
      custom_login.find('>div:not(:first-child)').addClass('hide');
      toggle_divs.on('click', function (e) {
        e.preventDefault();
        var toggle_index = $(this).index();
        toggle_divs.removeClass('hide');
        $(toggle_divs[toggle_index]).addClass('hide');
        custom_login_divs.addClass('hide');
        $(custom_login_divs[toggle_index]).removeClass('hide');
      });
    };

    if ($('.woocommerce-myaccount-account-info-toggle').length > 0) {
      $.agni_woocommerce_myaccount_toggle($('.woocommerce-myaccount-account-info-toggle'));
    }

    $.social_login_fb = {
      init: function init($this) {
        $.ajaxSetup({
          cache: true
        });
        $.getScript("https://connect.facebook.net/en_US/sdk.js", function () {
          FB.init({
            appId: cartify_woocommerce.fb_app_id,
            version: "v7.0"
          });
        });
        $this.on("click", function () {
          $('.site-header-icon-myaccount__loader').addClass('active');
          FB.getLoginStatus(function (response) {
            if (response.status === "connected") {
              $.social_login_fb.getDetails($this, response);
            } else {
              $.social_login_fb.login($this);
            }
          });
        });
      },
      getDetails: function getDetails($this, response) {
        var authResponse = response.authResponse;
        FB.api("/" + authResponse.userID, {
          fields: ['email', 'name', 'picture'],
          access_token: authResponse.accessToken
        }, function (response) {
          $.social_login_fb.sendDetailsAjax($this, response);
        });
      },
      login: function login($this) {
        FB.login(function (response) {
          if (response.authResponse) {
            $('.site-header-icon-myaccount__loader').html('Fetching information...');
            FB.api("/me", {
              fields: ['email', 'name', 'picture']
            }, function (response) {
              $.social_login_fb.sendDetailsAjax($this, response);
            });
          } else {
            $('.site-header-icon-myaccount__loader').removeClass('active');
          }
        }, {
          scope: ['email', 'public_profile'],
          return_scopes: true
        });
      },
      sendDetailsAjax: function sendDetailsAjax($this, response) {
        var data = {
          id: response.id,
          name: response.name,
          email: response.email,
          picture: response.picture
        };
        $.ajax({
          url: cartify_woocommerce.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_social_login'),
          type: 'POST',
          data: data,
          success: function success(res) {
            $('.site-header-icon-myaccount__loader').removeClass('active');
            location.reload();
          }
        });
      }
    };
    $.social_login_google = {
      init: function init($this) {
        if (cartify_woocommerce.google_client_id) {
          console.log("found client id");
          gapi.load('auth2', function () {
            var auth2 = gapi.auth2.init({
              client_id: cartify_woocommerce.google_client_id,
              cookiepolicy: 'single_host_origin'
            });
            $this.on('click', function () {
              var isSignedIn = auth2.isSignedIn.get();

              if (!isSignedIn) {
                auth2.signIn().then(function () {
                  $.social_login_google.sendProfileAjax($this, auth2.currentUser.get().getBasicProfile());
                });
              } else {
                $.social_login_google.sendProfileAjax($this, auth2.currentUser.get().getBasicProfile());
              }
            });
          });
        }
      },
      sendProfileAjax: function sendProfileAjax($this, response) {
        var data = {
          id: response.getId(),
          name: response.getName(),
          email: response.getEmail(),
          picture: response.getImageUrl()
        };
        $.ajax({
          url: cartify_woocommerce.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_social_login'),
          type: 'POST',
          data: data,
          success: function success(res) {
            location.reload();
          }
        });
      }
    };

    if ($('#login-btn-facbook').length > 0) {
      $.social_login_fb.init($('#login-btn-facbook'));
    }

    if ($('#login-btn-google').length > 0) {
      console.log("called");
      $.social_login_google.init($('#login-btn-google'));
    }

    $.agni_woocommerce_tabs = {
      hideDefaultTabs: function hideDefaultTabs(tabs) {
        var tabs_ul = tabs.find('>ul');
        tabs_ul.hide();
      },
      activeTab: function activeTab(panel_title) {},
      stickyDefaultTabs: function stickyDefaultTabs(tabs) {
        var tabs_ul = tabs.find('>ul');
        tabs.prepend('<ul class="tabs-sticky">' + tabs_ul.html() + '</ul>');
        var panel_title = tabs.find('.tabs-sticky li');
        var panel_title_height = tabs.find('.panel-title').height();
        $('.tabs-sticky').agni_page_scroll(panel_title_height);
        panel_title.find('a').on('click', function (e) {
          e.preventDefault();

          if ($(this).parent().hasClass('active')) {
            $(this).parent().removeClass('active');
          } else {
            panel_title.removeClass('active');
            $(this).parent().addClass('active');
          }
        });
      },
      showPanelContent: function showPanelContent(tabs) {
        var panel_title = tabs.find('.panel-title');
        panel_title.each(function () {
          var panel_target_id = $(this).find('a').attr('href').substr(1);
          var target_content = tabs.find('#' + panel_target_id);
          target_content.show();
        });
      },
      activePanel: function activePanel(tabs, tab_id) {
        var tabs_panel = tabs.find('.panel');
        var panel_title = tabs.find('.panel-title');
        $(panel_title[tab_id]).addClass('active');
        $(tabs_panel[tab_id]).addClass('active');
      },
      panelToggle: function panelToggle(tabs) {
        var tabs_panel = tabs.find('.panel');
        var panel_title = tabs.find('.panel-title');
        tabs_panel.each(function () {
          if (!$(this).hasClass('active')) {
            $(this).css({
              'display': 'none'
            });
          }
        });
        panel_title.find('a').on('click', function (e) {
          e.preventDefault();
          var panel_target_id = $(this).attr('href').substr(1);
          var target_content = tabs.find('#' + panel_target_id);

          if ($(this).parent().hasClass('active')) {
            $(this).parent().removeClass('active');
          } else {
            if (!tabs.parent().hasClass('has-toggle')) {
              panel_title.removeClass('active');
            }

            $(this).parent().addClass('active');
          }

          if (target_content.hasClass('active')) {
            target_content.removeClass('active');
            target_content.slideUp(200);
          } else {
            if (!tabs.parent().hasClass('has-toggle')) {
              tabs_panel.removeClass('active');
              tabs_panel.slideUp(200);
            }

            target_content.addClass('active');
            target_content.slideDown(200);
          }
        });
      },
      generatePanelTitle: function generatePanelTitle(tabs) {
        var tabs_li = tabs.find('>ul li');
        tabs_li.each(function () {
          var $tab_li = $(this);
          var target = $tab_li.find('a');
          var target_id = target.attr('href').substr(1);
          var target_content = tabs.find('#' + target_id);
          var $tab_li_classList = $tab_li.attr('class').split(/\s+/);
          var tab_heading = '<div class="panel-title ' + $tab_li_classList[0] + '">' + $tab_li.html() + '</div>';

          if (target_content) {
            $(tab_heading).insertBefore(target_content);
          }
        });
      }
    };

    if ($('.woocommerce-tabs').length > 0) {
      $('.woocommerce-tabs').each(function () {
        var tabs = $(this);
        var tabs_parent = tabs.parent('.agni-product-layout-block-tabs');

        if (tabs_parent.hasClass('style-3') || tabs_parent.hasClass('has-accordion-mobile') && window.innerWidth < 667) {
          $.agni_woocommerce_tabs.hideDefaultTabs(tabs);
          $.agni_woocommerce_tabs.generatePanelTitle(tabs);

          if (tabs_parent.hasClass('has-accordion-style-1') || tabs_parent.hasClass('has-accordion-style-2')) {
            $.agni_woocommerce_tabs.activePanel(tabs, '0');
          }

          $.agni_woocommerce_tabs.panelToggle(tabs);
        } else if (tabs_parent.hasClass('style-4')) {
          $.agni_woocommerce_tabs.hideDefaultTabs(tabs);
          $.agni_woocommerce_tabs.generatePanelTitle(tabs);
          $.agni_woocommerce_tabs.showPanelContent(tabs);
          $.agni_woocommerce_tabs.stickyDefaultTabs(tabs);
        }
      });
    }

    $.agni_woocommerce_checkout = {
      init: function init($this) {
        var $woocommerce = $this.closest('.woocommerce');
        var lis = $this.find('li');
        $.agni_woocommerce_checkout.toggleContents($woocommerce, lis);
        lis.on('click', function (e) {
          e.preventDefault();
        });
        var requiredValidationArray = ['.woocommerce-billing-fields'];
        $('#customer_details_navigation a').on('click', function (e) {
          e.preventDefault();
          var $woocommerce = $this.closest('.woocommerce');
          var lis = $this.find('li');

          if ($(this).hasClass('prev')) {
            var current_id = $(this).attr('href').substr(1);
            $.agni_woocommerce_checkout.toggleContents($woocommerce, lis, current_id);
            return null;
          }

          $('#createaccount').is(":checked") ? requiredValidationArray.push('.woocommerce-account-fields') : "";
          $('#ship-to-different-address-checkbox').is(":checked") ? requiredValidationArray.push('.woocommerce-shipping-fields') : "";
          $(requiredValidationArray.join(',')).find('p').each(function () {
            if ($(this).hasClass('validate-required')) {
              var id = $(this).attr('id').replace('_field', '');

              if (!$('#' + id).val()) {
                if (!$(this).find('span').hasClass('woocommerce-error')) {
                  $(this).append('<span class="woocommerce-error">Field is required</span>');
                }

                console.log("id", id);
                $('html, body').stop().animate({
                  scrollTop: $('#' + id).offset().top
                }, 400);
              } else {
                $(this).find('.woocommerce-error').remove();
              }
            }
          });
          $.agni_woocommerce_checkout.ajaxErrorValidation($woocommerce, lis, $(this));
        });
        $('.woocommerce-checkout-guest-button, #account_info_navigation a, #review_order_table_navigation a, #payment_navigation a').on('click', function (e) {
          e.preventDefault();
          var current_id = $(this).attr('href').substr(1);
          $.agni_woocommerce_checkout.toggleContents($woocommerce, lis, current_id);
        });
        $.agni_woocommerce_checkout.onInputChange(requiredValidationArray);
      },
      onInputChange: function onInputChange(requiredValidationArray) {
        $(requiredValidationArray.join(',')).find('p').each(function () {
          var p = $(this);

          if ($(this).hasClass('validate-required')) {
            var id = $(this).attr('id').replace('_field', '');
            $('#' + id).on('input', function () {
              p.find('.woocommerce-error').remove();
            });
          }
        });
      },
      ajaxErrorValidation: function ajaxErrorValidation($woocommerce, lis, $next) {
        if ($('#customer_details').find('.woocommerce-error').length > 0) {
          return null;
        }

        var $form = $('form.checkout');
        var formData = $form.serializeArray();
        var checklist = {
          'email': false,
          'phone': false,
          'billing_address': false,
          'shipping_options': false
        };
        $.ajax({
          type: 'POST',
          url: cartify_woocommerce.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_multistep_address_validation'),
          data: formData,
          success: function success(res) {
            if (typeof res.data.email !== 'undefined') {
              if (!res.data.email) {
                var $email = $('#billing_email_field');

                if (!$email.find('span').hasClass('woocommerce-error')) {
                  $email.append('<span class="woocommerce-error">Invalid email field.</span>');
                }
              } else {
                checklist['email'] = true;
              }
            } else {
              delete checklist['email'];
            }

            if (typeof res.data.phone !== 'undefined') {
              if (!res.data.phone) {
                var $phone = $('#billing_phone_field');

                if (!$phone.find('span').hasClass('woocommerce-error')) {
                  $phone.append('<span class="woocommerce-error">Invalid phone field.</span>');
                }
              } else {
                checklist['phone'] = true;
              }
            } else {
              delete checklist['phone'];
            }

            if (res.data.valid_billing_address) {
              checklist['billing_address'] = true;
            }

            if (res.data.shipping_options !== null && !res.data.shipping_options[0]) {
              var $shipping = $('#ship-to-different-address-checkbox').is(":checked") ? $('#shipping_country_field, #shipping_postcode_field') : $('#billing_country_field, #billing_postcode_field');
              ;

              if (!$shipping.find('span').hasClass('woocommerce-error')) {
                $shipping.append('<span class="woocommerce-error">No shipping options available for this postcode or country.</span>');
              }
            } else {
              checklist['shipping_options'] = true;
            }

            var isAddressPassed = Object.values(checklist).every(function (ele) {
              return ele === true;
            });

            if (isAddressPassed) {
              var current_id = $next.attr('href').substr(1);
              $.agni_woocommerce_checkout.toggleContents($woocommerce, lis, current_id);
            }
          }
        });
      },
      toggleContents: function toggleContents($woocommerce, lis) {
        var current_id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        lis.each(function () {
          var li = $(this);
          var li_id = li.find('a').attr('href').substr(1);
          var li_content = $woocommerce.find('#' + li_id);
          var li_nav = $woocommerce.find('#' + li_id + '_navigation');

          if (current_id) {
            li.removeClass('active');
          }

          if (li.hasClass('active') || li_id == current_id) {
            li.addClass('active');
            li_content.css({
              'display': 'block'
            });
            li_nav.css({
              'display': 'block'
            });
          } else {
            li.removeClass('active');
            li_content.css({
              'display': 'none'
            });
            li_nav.css({
              'display': 'none'
            });
          }

          if ($("#review_order_table").is(':visible')) {
            $('body').on('updated_checkout', function () {
              $("#review_order_table").css({
                "display": 'block'
              });
            });
          }
        });
      }
    };

    if ($('.agni-woocommerce-multistep-checkout').length > 0) {
      $.agni_woocommerce_checkout.init($('.agni-woocommerce-multistep-checkout'));
    }

    $.agni_woocommerce_checkout_login_popup = {
      init: function init($this) {
        var $account_info_form = $('.woocommerce-checkout-account-info');
        var account_info_form_overlay_class = 'woocommerce-checkout-account-info__overlay';
        $this.on('click', function (e) {
          e.preventDefault();
          $account_info_form.hasClass('hide') ? $account_info_form.removeClass('hide') : $account_info_form.addClass('hide');
        });
        $account_info_form.on('click', '.woocommerce-checkout-account-info__overlay, .woocommerce-checkout-account-info__close', function () {
          $this.trigger('click');
        });
      }
    };

    if ($('.woocommerce-checkout-account-info-toggle').length > 0) {
      $.agni_woocommerce_checkout_login_popup.init($('.woocommerce-checkout-account-info-toggle'));
    }

    $.agni_woocommerce_login_toggle = {
      init: function init($this) {
        var toggleContentArray = ['.woocommerce-checkout-account-info__login', '.woocommerce-checkout-account-info__register'];
        $this.find('.woocommerce-checkout-account-info__toggle').each(function () {
          var toggle_link = $(this).find('a');
          toggle_link.on('click', function (e) {
            e.preventDefault();
            toggle_link.parent().removeClass('hide');
            $(this).parent().addClass('hide');
            var toggle_id = $(this).attr('href').substr(1);
            var toggle_content = $this.find('#' + toggle_id);
            $(toggleContentArray.join(',')).each(function () {
              $(this).addClass('hide');
            });
            toggle_content.removeClass('hide');
          });
        });
      }
    };

    if ($('.woocommerce-checkout-account-info').length > 0) {
      $.agni_woocommerce_login_toggle.init($('.woocommerce-checkout-account-info'));
    }

    $('.agni-filter-toggle a').on('click', function (e) {
      e.preventDefault();
      var $this = $(this);
      var content = $this.data('content-class');

      if (window.innerWidth < 1024) {
        var toggle_content = 'shop-sidebar';

        if ($("." + toggle_content).hasClass('active')) {
          $("." + toggle_content).removeClass('active');
        } else {
          $("." + toggle_content).addClass('active');
        }
      } else if (content) {
        if ($("." + content).hasClass('active')) {
          $("." + content).removeClass('active');
        } else {
          $("." + content).addClass('active');
        }
      }
    });
    $('.shop-sidebar').each(function () {
      var $this = $(this);
      $('.shop-sidebar-close, .shop-sidebar-btn-close, .shop-sidebar-overlay').on('click', function (e) {
        e.preventDefault();
        var shop_sidebar = $(this).closest('.shop-sidebar');
        shop_sidebar.hasClass('active') ? shop_sidebar.removeClass('active') : shop_sidebar.addClass('active');
      });
    });
    $('.shop-sidebar-content__toggle').on('click', function (e) {
      e.preventDefault();
      var $this = $(this);

      if ($this.hasClass('active')) {
        $this.removeClass('active');
        $('.shop-sidebar-content__sidebar').removeClass('active');
      } else {
        $this.addClass('active');
        $('.shop-sidebar-content__sidebar').addClass('active');
      }
    });
    $(document).on('click', '.agni-woocommerce-pagination:not(.has-ajax) .agni-woocommerce-pagination-infinite', function (e) {
      e.preventDefault();
      var $this = $(this);
      var $products = $this.closest('.agni-woocommerce-pagination').siblings('.products');
      var options = $this.data('infinite-options');
      var data = {
        options: options,
        security: cartify_woocommerce.security
      };
      $this.addClass('infinite-loading');
      $.ajax({
        type: 'POST',
        url: cartify_woocommerce.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_woocommerce_pagination'),
        data: data,
        success: function success(res) {
          $this.data('infinite-options', options);

          if (res.success) {
            var appendProducts = res.data.products;
            var newCurrentPageNum = res.data.current_page_num;
            $this.removeClass('infinite-loading');
            $(appendProducts).each(function () {
              var product = $(this);
              var new_thumbnails_container = product.find('.woocommerce-loop-product__thumbnail');
              new_thumbnails_container.not('.slick-initialized').each(function () {
                var $this = $(this);

                if ($this.hasClass('style-3') && $this.children().length > 1) {
                  $.agni_scripts.archives_gallery_slider($this);
                }
              });

              if (!options['category']) {
                product.find('.woocommerce-loop-product__category').remove();
              }

              if (!options['quickview']) {
                product.find('.agni-quickview').remove();
              }

              if (!options['compare']) {
                product.find('.agni-add-to-compare').remove();
              }

              if (!options['stock']) {
                product.find('.agni-stock-indicator').remove();
              }

              if (!options['countdown']) {
                product.find('.agni-sale-countdown').remove();
              }

              $products.append(product);
            });
            $('.agni-sale-countdown').each(function () {
              $.agni_sale_countdown.init($(this));
            });

            if (typeof wc_add_to_cart_variation_params !== 'undefined') {
              $('.variations_form').each(function () {
                $(this).wc_variation_form();
              });
            }

            options['current'] = newCurrentPageNum;
            $this.data('infinite-options', options);

            if (newCurrentPageNum < options['total']) {
              $this.addClass('infinite-auto-load');
            } else {
              $this.remove();
            }
          }
        }
      });
    });
    $('.agni-add-to-cart-sticky').each(function () {
      var $this = $(this),
          $elem = $this.closest('.product'),
          $elem_height = $elem.height(),
          $elem_top = $elem.offset().top,
          $elem_bottom = $elem.offset().top + $elem_height - window.innerHeight;
      $(window).on('scroll', function () {
        if ($elem_top < $(this).scrollTop() && $elem_bottom > $(this).scrollTop()) {
          $this.addClass('active');
        } else {
          $this.removeClass('active');
        }
      });
    });
    $(window).on('scroll', function () {
      if ($('.agni-woocommerce-pagination-infinite').hasClass('infinite-auto-load') && !$('.agni-woocommerce-pagination').hasClass('has-ajax')) {
        var $this = $('.agni-woocommerce-pagination-infinite');
        var $products = $this.closest('.agni-woocommerce-pagination').siblings('.products');
        var products_end_position = $products.height() + $products.offset().top - $(window).height();

        if ($(document).scrollTop() > products_end_position) {
          $('.infinite-auto-load').trigger('click');
          $this.removeClass('infinite-auto-load');
        }
      }
    });
  });
})(jQuery);