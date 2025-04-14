"use strict";

jQuery(document).ready(function ($) {
  'use strict';

  $(document.body).on('wc_fragment_refresh', $.cart_contents_loader_show);

  $.cart_contents_loader_show = function () {
    $('.agni-sidecart__loader').addClass('active');
  };

  $.cart_contents_loader_hide = function () {
    $('.agni-sidecart__loader').removeClass('active');
  };

  $.cart_loader_show = function (adding_cart_text) {
    $('body').append('<div id="agni-ajax-sidecart-loader" class="agni-ajax-sidecart-loader">' + adding_cart_text + '</div>');
  };

  $.cart_loader_hide = function () {
    $('body').find('#agni-ajax-sidecart-loader').remove();
  };

  $.cart_show = function () {
    $('.agni-sidecart').addClass('active');
  };

  $.cart_hide = function () {
    $('.agni-sidecart').removeClass('active');
  };

  $.cart_toggle = function () {
    if ($('.agni-sidecart').hasClass('active')) {
      $.cart_hide();
    } else {
      $.cart_show();
    }
  };

  $.coupon_loading_show = function () {
    $('.agni-sidecart__coupon .coupon').append('<span class="agni-ajax-sidecart-loader-coupon">Adding Coupon</span>');
  };

  $.coupon_loading_hide = function () {
    $('.agni-sidecart__coupon .agni-ajax-sidecart-loader-coupon').remove();
  };

  $.coupon_toggle = function () {
    var $coupon = $('.agni-sidecart__coupon');

    if ($coupon.hasClass('active')) {
      $coupon.removeClass('active');
    } else {
      $coupon.addClass('active');
    }
  };

  $('.site-header-icons-cart__link').add($('.agni-shop-dock-cart__link:not(.has-custom-link)')).on('click', function (e) {
    if ($(this).parent().hasClass('no-sidecart')) {
      return null;
    }

    e.preventDefault();
    $.cart_toggle();
  });
  $('body').on('click', '.agni-sidecart__close , .agni-sidecart__overlay', function (e) {
    e.preventDefault();
    $.cart_hide();
  });
  $('body').on('click', '.agni-sidecart__coupon-text', function () {
    $.coupon_toggle();
  });

  $.add_to_cart = function (atc_btn, product_data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var buynow = options['buynow'] ? options['buynow'] : false;
    var update_qty = true;
    atc_btn.addClass('loading');
    Object.values(product_data).includes("test1");
    var product_id = '';
    var data_values = [];

    if (Array.isArray(product_data)) {
      product_data.forEach(function (data) {
        if (data.value.length == 0) {
          data_values.push('error');
        }

        if (data.name == "product_id") {
          product_id = data.value;
        }
      });
    } else {
      product_id = product_data['product_id'];
    }

    $(document.body).trigger('adding_to_cart', [atc_btn, product_data]);
    $.ajax({
      url: cartify_ajax_sidecart.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_ajax_add_to_cart'),
      type: 'POST',
      data: product_data,
      dataType: 'json',
      beforeSend: function beforeSend() {},
      complete: function complete() {},
      success: function success(response) {
        if (!response) {
          return;
        }

        if (response.fragments) {
          $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, atc_btn]);

          if ($('.agni-update-cart').length != 0) {
            $('.agni-update-cart').each(function () {
              if ($(this).data('product_id') == product_id) {
                $(this).addClass('active');
              }
            });
          }

          if (buynow) {
            window.location.href = cartify_ajax_sidecart.checkout_url;
          }

          if (!buynow) {
            $.cart_loader_hide();
            $.cart_contents_loader_hide();
            $.cart_show();
          }
        } else {
          console.log(response);
          alert(response);
        }
      }
    });
  };

  $.update_cart = function (cart_key, new_qty) {
    $.ajax({
      url: cartify_ajax_sidecart.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_ajax_update_cart'),
      type: 'POST',
      data: {
        security: cartify_ajax_sidecart.security,
        cart_key: cart_key,
        new_qty: new_qty
      },
      dataType: 'json',
      success: function success(response) {
        if (!response) {
          return;
        }

        if (response.fragments) {
          $.each(response.fragments, function (key, value) {
            $(key).replaceWith(value);
            $(key).stop(true).css('opacity', '1').unblock();
          });
          $(document.body).trigger('wc_fragments_loaded');
        } else {
          console.log(response);
        }
      },
      complete: function complete() {
        $.cart_contents_loader_hide();
      }
    });
  };

  $.apply_coupon = function ($form) {
    var $text_field = $form.find('#coupon_code');
    var coupon_code = $text_field.val();
    var data = {
      security: cartify_ajax_sidecart.security,
      coupon_code: coupon_code
    };
    $.ajax({
      type: 'POST',
      url: cartify_ajax_sidecart.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_ajax_apply_coupon'),
      data: data,
      dataType: 'json',
      success: function success(response) {
        if (!response.success) {
          var footer_div = $('.agni-sidecart__footer .agni-sidecart__coupon-text');

          if (!footer_div.children('.woocommerce-notices-wrapper').length) {
            footer_div.prepend("<div class='woocommerce-notices-wrapper'></div>");
          }

          footer_div.children('.woocommerce-notices-wrapper').html('<div class="woocommerce-error" role="alert">' + response.data + '</div>');
          return;
        }

        $(document.body).trigger('applied_coupon', [coupon_code]);
        $.ajax({
          type: 'POST',
          url: cartify_ajax_sidecart.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_ajax_get_cart_totals'),
          data: '',
          success: function success(fragmentsResponse) {
            if (fragmentsResponse.fragments) {
              $.each(fragmentsResponse.fragments, function (key, value) {
                $(key).replaceWith(value);
                $(key).stop(true).css('opacity', '1').unblock();
              });
              $(document.body).trigger('wc_fragments_loaded');
              var footer_div = $('.agni-sidecart__footer .agni-sidecart__coupon-text');

              if (!footer_div.children('.woocommerce-notices-wrapper').length) {
                footer_div.prepend("<div class='woocommerce-notices-wrapper'></div>");
              }

              footer_div.children('.woocommerce-notices-wrapper').html('<div class="woocommerce-message" role="alert">' + response.data + '</div>');
            }
          }
        });
      },
      complete: function complete() {
        $text_field.val('');
        $.cart_contents_loader_hide();
      }
    });
  };

  $.remove_coupon_clicked = function ($this) {
    var coupon = $this.attr('data-coupon');
    var data = {
      security: cartify_ajax_sidecart.security,
      coupon: coupon
    };
    $.ajax({
      type: 'POST',
      url: cartify_ajax_sidecart.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_ajax_remove_coupon'),
      data: data,
      dataType: 'json',
      success: function success(response) {
        if (!response.success) {
          var footer_div = $('.agni-sidecart__footer .agni-sidecart__coupon-text');

          if (!footer_div.children('.woocommerce-notices-wrapper').length) {
            footer_div.prepend("<div class='woocommerce-notices-wrapper'></div>");
          }

          footer_div.children('.woocommerce-notices-wrapper').html('<div class="woocommerce-error" role="alert">' + response.data + '</div>');
          return;
        }

        $(document.body).trigger('removed_coupon', [coupon]);
        $.ajax({
          type: 'POST',
          url: cartify_ajax_sidecart.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_ajax_get_cart_totals'),
          data: '',
          success: function success(fragmentsResponse) {
            if (fragmentsResponse.fragments) {
              $.each(fragmentsResponse.fragments, function (key, value) {
                $(key).replaceWith(value);
                $(key).stop(true).css('opacity', '1').unblock();
              });
              $(document.body).trigger('wc_fragments_loaded');
              var footer_div = $('.agni-sidecart__footer .agni-sidecart__coupon-text');

              if (!footer_div.children('.woocommerce-notices-wrapper').length) {
                footer_div.prepend("<div class='woocommerce-notices-wrapper'></div>");
              }

              footer_div.children('.woocommerce-notices-wrapper').html('<div class="woocommerce-message" role="alert">' + response.data + '</div>');
            }
          }
        });
      },
      complete: function complete() {
        $.cart_contents_loader_hide();
      }
    });
  };

  $(document).on('click', '.agni-sidecart__remove', function (e) {
    e.preventDefault();
    $.cart_contents_loader_show();
    var product_row = $(this).parents('.agni-sidecart__product');
    var cart_key = product_row.data('item-key');
    $.update_cart(cart_key, 0);
  });
  $(document).on('change', '.agni-sidecart__product input.qty, .agni-sidecart__product select.qty', function (e) {
    e.preventDefault();
    $.cart_contents_loader_show();
    var $this = $(this);
    var new_qty = parseInt($this.val());
    var product_row = $this.parents('.agni-sidecart__product');
    var cart_key = product_row.data('item-key');
    $.update_cart(cart_key, new_qty);
  });
  $(document).on('submit', 'form.cart', function (e) {
    var buynow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var form = $(this);
    var $product = form.closest('.product').hasClass('product-type-external');
    var $add_to_cart_redirect = form.parent().hasClass('has-cart-redirect');

    if ($product) {
      return null;
    }

    if ($add_to_cart_redirect) {
      return null;
    }

    e.preventDefault();
    var atc_btn = form.find('button[type="submit"]');
    var adding_cart_text = "Adding to Cart!";
    var product_data = form.serializeArray();

    if (atc_btn.attr('name') && atc_btn.attr('name') == 'add-to-cart' && atc_btn.attr('value')) {
      product_data.push({
        name: 'add-to-cart',
        value: atc_btn.attr('value')
      });
    }

    product_data.push({
      name: 'action',
      value: 'agni_ajax_add_to_cart'
    });
    $.cart_contents_loader_show();
    $.add_to_cart(atc_btn, product_data, {
      'buynow': buynow
    });
  });
  $(document).on('click', '.product_type_simple.ajax_add_to_cart', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $adding_to_cart_text = "Adding to Cart!";
    var data = {};
    $.each($this.data(), function (key, value) {
      data[key] = value;
    });
    data['add-to-cart'] = data['product_id'];
    $.add_to_cart($this, data);
  });
  $('.agni-sidecart').on('submit', 'form.woocommerce-coupon-form', function (e) {
    e.preventDefault();
    var $form = $(this);
    $.cart_contents_loader_show();
    $.apply_coupon($form);
  });
  $('.agni-sidecart').on('click', '.woocommerce-remove-coupon', function (e) {
    e.preventDefault();
    var coupon_remove = $(this);
    $.cart_contents_loader_show();
    $.remove_coupon_clicked(coupon_remove);
  });
  $('.agni-sidecart').on('change', '.woocommerce-shipping-methods', function () {
    var $this = $(this);
    var shipping_method = $this.find('input:checked').val();
    $.cart_contents_loader_show();
    $.ajax({
      type: 'POST',
      url: cartify_ajax_sidecart.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_ajax_update_shipping_method'),
      data: {
        shipping_method: shipping_method
      },
      dataType: 'json',
      success: function success(response) {
        if (response.fragments) {
          $.each(response.fragments, function (key, value) {
            $(key).replaceWith(value);
            $(key).stop(true).css('opacity', '1').unblock();
          });
          $(document.body).trigger('wc_fragments_loaded');
        } else {
          console.log(response);
        }
      },
      complete: function complete() {
        $.cart_contents_loader_hide();
      }
    });
  });
});