"use strict";

(function ($) {
  'use strict';

  $(document).ready(function () {
    console.log("Agni Wishlist");

    $.agni_wishlist_loader_show = function () {
      $('.agni-wishlist__loader').addClass('active');
    };

    $.agni_wishlist_loader_hide = function () {
      $('.agni-wishlist__loader').removeClass('active');
    };

    $.agni_wishlist = {
      togglePopup: function togglePopup($this) {
        if ($this.hasClass('active')) {
          $this.removeClass('active');
        } else {
          $this.addClass('active');
        }
      },
      closePopup: function closePopup($this) {
        $this.removeClass('active');
      },
      init: function init($this) {
        var btn = $this.find('.agni-add-to-wishlist__button:not(.user-logged-out) a'),
            $form = $this.closest('.entry-summary').find('.variations_form.cart');
        $form.on('hide_variation', function () {
          btn.removeClass('wc-variation-is-unavailable').addClass('disabled wc-variation-selection-needed');
        });
        $form.on('show_variation', function () {
          btn.removeClass('disabled wc-variation-selection-needed wc-variation-is-unavailable');
        });
        btn.on('click', function (e) {
          e.preventDefault();
          $.agni_wishlist.click($this, btn);
        });
        $this.on('click', '.agni-add-to-wishlist__panel-close', function (e) {
          e.preventDefault();
          $.agni_wishlist.closePopup($this.find('.agni-add-to-wishlist__panel'));
        });
        $('body').on('click', function (e) {
          var wishlist = $('.agni-add-to-wishlist');

          if (!wishlist.is(e.target) && wishlist.has(e.target).length === 0) {
            $('.agni-add-to-wishlist__panel-close').trigger('click');
          }
        });
      },
      click: function click($this, btn) {
        if (btn.is('.disabled')) {
          if (btn.is('.wc-variation-is-unavailable')) {
            window.alert(wc_add_to_cart_variation_params.i18n_unavailable_text);
          } else if (btn.is('.wc-variation-selection-needed')) {
            window.alert(wc_add_to_cart_variation_params.i18n_make_a_selection_text);
          }
        } else {
          $.agni_wishlist.togglePopup($this.find('.agni-add-to-wishlist__panel'));
          var wishlist_data = {};
          var searchParams = new URLSearchParams(btn.attr('href'));
          searchParams.forEach(function (value, key) {
            wishlist_data[key] = value;
          });
          var $variation_input = $this.closest('.entry-summary').find('.variations_form.cart input[name="variation_id"]');

          if ($variation_input.length > 0) {
            wishlist_data['variation_id'] = $variation_input.val();
          }

          $.agni_wishlist.processForm($this, wishlist_data);
        }
      },
      processForm: function processForm($this, wishlist_data) {
        var panel = $this.find('.agni-add-to-wishlist__panel-contents');
        var data = wishlist_data;
        $this.on('click', '.agni-add-to-wishlist__existing-list a', function (e) {
          e.preventDefault();
          $.agni_wishlist_loader_show();
          var wishlist_id = $(this).data('wishlist-id');
          delete data['wishlist_name'];
          $.agni_wishlist.postAjax(panel, data, wishlist_id);
        });
        $this.on('submit', 'form.agni-add-to-wishlist-form', function (e) {
          e.preventDefault();
          $.agni_wishlist_loader_show();
          var form = $(this);
          var formData = form.serializeArray();
          formData.forEach(function (field) {
            data[field.name] = field.value || data[field.name];
          });
          $.agni_wishlist.postAjax(panel, data);
        });
      },
      postAjax: function postAjax(panel, data) {
        var wishlist_id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var param = wishlist_id ? '/' + wishlist_id : '';
        $.ajax({
          url: cartify_wishlist.resturl + '/wishlist' + param,
          type: 'POST',
          data: data,
          success: function success(response) {
            if (!response) {
              return;
            }

            panel.html(response);
            $.agni_wishlist_loader_hide();
          }
        });
      }
    };
    $('.agni-add-to-wishlist').each(function () {
      $.agni_wishlist.init($(this));
    });
    $.agni_wishlist_page = {
      init: function init($this) {
        $this.on('change', 'select', function (e) {
          $.agni_wishlist_page.getAjax(e.target.value);
        });
        $this.on('click', '.agni-wishlist-page-wishlist__delete', function (e) {
          e.preventDefault();
          var delete_confirmation = confirm("Are you sure you want to delete this item?");

          if (!delete_confirmation) {
            return null;
          }

          var searchParams = new URLSearchParams($(this).attr('href'));
          var wishlist_id = searchParams.get("remove_wishlist");
          var param = wishlist_id ? '/' + wishlist_id : '';
          $.ajax({
            url: cartify_wishlist.resturl + '/wishlist' + param,
            type: 'DELETE',
            data: {
              'wishlist_id': wishlist_id
            },
            success: function success(response) {
              if (!response) {
                return;
              }

              window.location.assign(response.redirect_url);
            }
          });
        });
        $this.on('click', '.agni-wishlist-product__remove', function (e) {
          e.preventDefault();
          var product = $(this);
          console.log(product.attr('href'));
          $.agni_wishlist_page.removeItems(product.attr('href'));
        });
        $this.on('click', '.agni-wishlist-page__new-link', function (e) {
          e.preventDefault();
          $.agni_wishlist.togglePopup($this.find('.agni-wishlist-page__new-panel'));
        });
        $this.on('click', '.agni-wishlist-page-wishlist__settings-link', function (e) {
          e.preventDefault();
          $.agni_wishlist.togglePopup($this.find('.agni-wishlist-page-wishlist__settings-panel'));
        });
        $.agni_wishlist_page.newPopup($this);
        $.agni_wishlist_page.settingsPopup($this);
        $this.on('click', '.agni-wishlist-page-wishlist__settings-panel-close', function (e) {
          e.preventDefault();
          $.agni_wishlist.closePopup($this.find('.agni-wishlist-page-wishlist__settings-panel'));
        });
        $this.on('click', '.agni-wishlist-page__new-panel-close', function (e) {
          e.preventDefault();
          $.agni_wishlist.closePopup($this.find('.agni-wishlist-page__new-panel'));
        });
        $('body').on('click', function (e) {
          var wishlist_settings = $('.agni-wishlist-page__new, .agni-wishlist-page-wishlist__settings');

          if (!wishlist_settings.is(e.target) && wishlist_settings.has(e.target).length === 0) {
            $('.agni-wishlist-page__new-panel-close').trigger('click');
            $('.agni-wishlist-page-wishlist__settings-panel-close').trigger('click');
          }
        });
      },
      settingsPopup: function settingsPopup($this) {
        $this.on('submit', '.agni-wishlist-page-wishlist-settings-form', function (e) {
          e.preventDefault();
          $.agni_wishlist_loader_show();
          var panel = $this.find('.agni-wishlist-page-wishlist__settings-panel-contents');
          var data = {};
          var formData = $(this).serializeArray();
          formData.forEach(function (field) {
            data[field.name] = field.value || data[field.name];
          });
          var wishlist_id = data['wishlist_id'];
          $.agni_wishlist.postAjax(panel, data, wishlist_id);
        });
      },
      newPopup: function newPopup($this) {
        $this.on('submit', '.agni-wishlist-page-new-form', function (e) {
          e.preventDefault();
          $.agni_wishlist_loader_show();
          var panel = $this.find('.agni-wishlist-page__new-panel-contents');
          var data = {};
          var formData = $(this).serializeArray();
          formData.forEach(function (field) {
            data[field.name] = field.value || data[field.name];
          });
          $.agni_wishlist.postAjax(panel, data);
        });
      },
      removeItems: function removeItems(removeHref) {
        var removeData = {};
        var searchParams = new URLSearchParams(removeHref);
        searchParams.forEach(function (value, key) {
          removeData[key] = value;
        });
        $.agni_wishlist_page.removeItemsAjax(removeData);
      },
      getAjax: function getAjax(wishlist_id) {
        $.ajax({
          url: cartify_wishlist.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_wishlist_page'),
          type: 'POST',
          data: {
            security: cartify_wishlist.security,
            wishlist_id: wishlist_id
          },
          success: function success(response) {
            var agni_wishlist_page = $('.agni-wishlist-page-wishlist');
            agni_wishlist_page.html(response);
          }
        });
      },
      removeItemsAjax: function removeItemsAjax(remove_data) {
        remove_data['remove_from_wishlist'] = true;
        console.log(remove_data);
        var wishlist_id = remove_data['wishlist_id'],
            param = wishlist_id ? '/' + wishlist_id : '';
        $.ajax({
          url: cartify_wishlist.resturl + '/wishlist' + param,
          type: 'POST',
          data: remove_data,
          success: function success(response) {
            console.log(response);
            $.agni_wishlist_page.getAjax(wishlist_id);
          }
        });
      }
    };
    $.agni_wishlist_page.init($('.agni-wishlist-page'));
  });
})(jQuery);