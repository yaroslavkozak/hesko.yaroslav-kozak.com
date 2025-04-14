"use strict";

(function ($) {
  'use strict';

  $(document).ready(function () {
    $.search_loader_show = function () {
      $('.agni-ajax-search__loader').addClass('active');
    };

    $.search_loader_hide = function () {
      $('.agni-ajax-search__loader').removeClass('active');
    };

    $.search_panel_show = function () {
      $('.agni-ajax-search-results').addClass('active');
    };

    $.search_panel_hide = function () {
      $('.agni-ajax-search-results').removeClass('active');
    };

    $.agni_ajax_search = {
      init: function init($this) {
        var $form = $this.find('.agni-ajax-search-form'),
            $input = $form.find('.agni-ajax-search-form__text'),
            $results = $this.find('.agni-ajax-search-results__container');
        var string_tolerance = 1;
        var $ajax_request = null;
        $input.on('input', function () {
          var data = {};
          var keyword = $(this).val();
          var $formData = $form.serializeArray();
          $formData.forEach(function (field) {
            data[field.name] = field.value;
          });
          data['action'] = cartify_ajax_search.action;
          data['security'] = cartify_ajax_search.security;

          if (keyword.replace(/\s/g, "").length > string_tolerance) {
            $.search_loader_show();

            if ($ajax_request && $ajax_request.readyState != 4) {
              $ajax_request.abort();
            }

            $ajax_request = $.ajax({
              url: cartify_ajax_search.ajaxurl,
              type: 'POST',
              data: data,
              success: function success(response) {
                $.search_loader_hide();
                $.search_panel_show();
                $results.html(response);
                $.agni_ajax_search.keyNavigation($results);
              }
            });
          } else {
            if ($ajax_request && $ajax_request.readyState != 4) {
              $ajax_request.abort();
            }

            $.search_loader_hide();
            $.search_panel_hide();
          }
        });
        $('body').on('click', function (e) {
          var search = $('.agni-ajax-search');

          if (!search.is(e.target) && search.has(e.target).length === 0) {
            $.search_panel_hide();
          }
        });
      },
      keyNavigation: function keyNavigation($results) {
        var li = $results.find('.agni-ajax-search-result');
        var liSelected;
        $(document).on('keydown', function (e) {
          if (e.which === 40) {
            $results.find('.agni-ajax-search-all-results').removeClass('selected');

            if (liSelected) {
              liSelected.removeClass('selected');

              if (!liSelected.is(':last-child')) {
                var next = liSelected.next();

                if (next.length > 0) {
                  liSelected = next.addClass('selected');
                } else {
                  liSelected = li.eq(0).addClass('selected');
                }
              } else {
                liSelected = $results.find('.agni-ajax-search-all-results');
                $results.find('.agni-ajax-search-all-results').addClass('selected');
                liSelected = '';
              }
            } else {
              liSelected = li.eq(0).addClass('selected');
              $results.closest('.agni-ajax-search').find('form').removeClass('selected');
            }
          } else if (e.which === 38) {
            $results.closest('.agni-ajax-search').find('form').removeClass('selected');

            if (liSelected) {
              liSelected.removeClass('selected');

              if (!liSelected.is(':first-child')) {
                var prev = liSelected.prev();

                if (prev.length > 0) {
                  liSelected = prev.addClass('selected');
                } else {
                  liSelected = li.last().addClass('selected');
                }
              } else {
                liSelected = $results.closest('.agni-ajax-search').find('form');
                $results.closest('.agni-ajax-search').find('form').addClass('selected');
                liSelected = '';
              }
            } else {
              liSelected = li.last().addClass('selected');
              $results.find('.agni-ajax-search-all-results').removeClass('selected');
            }
          }
        });
        $('.agni-ajax-search-form .agni-ajax-search-form__text').on('keyup', function (e) {
          if (e.which === 13) {
            $results.find('.agni-ajax-search-result').each(function () {
              if ($(this).hasClass('selected')) {
                e.preventDefault();
                window.location.assign($(this).find('a').attr('href'));
              }
            });
          }
        });
      }
    };
    $('.agni-ajax-search').each(function () {
      $(this).find('input').focus(function (e) {
        $(this).parents('form').addClass('focus');
      }).blur(function (e) {
        $(this).parents('form').removeClass('focus');
      });
    });
    $('.agni-ajax-search').each(function () {
      $.agni_ajax_search.init($(this));
    });
  });
})(jQuery);