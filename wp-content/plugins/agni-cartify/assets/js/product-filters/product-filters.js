/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ({

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

// JavaScript Document
!function ($) {
  "use strict";

  $(document).ready(function () {
    $('.shop-sidebar').find('.cartify_ajax_product_widget').each(function () {
      var $widget = $(this),
          $widget_title = $widget.find('.widget-title');
      $widget_title.on('click', function () {
        if ($widget.hasClass('expanded')) {
          $widget.removeClass('expanded');
        } else {
          $widget.addClass('expanded');
        }
      });
    });
    $('.shop-sidebar').find('.cartify_ajax_product_widget').each(function () {
      if (window.innerWidth < 1024) {
        var $widget = $(this),
            $widget_lis = $widget.find('li');
        $widget_lis.each(function () {
          var $widget_li = $(this);
          $widget_li.find('>a').on('click', function () {
            $widget_li.hasClass('chosen') ? $widget_li.removeClass('chosen') : $widget_li.addClass('chosen');
          });
        });
      }
    });
    $('.topbar').find('.cartify_ajax_product_widget').each(function () {
      var $top_bar = $(this).closest('.topbar');
      var $widget = $(this),
          $widget_title = $widget.find('.widget-title');

      if (!$widget.hasClass('expanded')) {
        $widget_title.on('click', function () {
          if ($widget.hasClass('show')) {
            $widget.removeClass('show');
            $top_bar.find('.overlay').remove();
          } else {
            $widget.addClass('show');
            $top_bar.append('<div class="overlay"></div>');
          }
        });
        $top_bar.on('click', '.overlay', function () {
          $widget.removeClass('show');
          $(this).remove();
        });
      }
    });
    $('.agni-product-categories').each(function () {
      var $this = $(this);
      var $parent = $this.find('.cat-parent');
      $parent.find('.cat-toggle').on('click', function () {
        // console.log("clicked");
        if ($(this).parent('.cat-parent').hasClass('expanded')) {
          $(this).parent('.cat-parent').removeClass('expanded');
        } else {
          $(this).parent('.cat-parent').addClass('expanded');
        }
      });
    });
    $.agni_product_filter = {
      ajax_request: null,
      init: function init() {
        this.onSubmit();
        var url = new URL(window.location.href);
        var url_params = url.search.slice(1);

        if (!url_params || url.searchParams.get('filter_product_cat') || url.searchParams.get('filter_product_brand') || url.searchParams.get('rating')) {
          this.ajax_init();
        }
      },
      onSubmit: function onSubmit() {
        $('.shop-sidebar-btn-apply').on('click', function () {
          $.agni_product_filter.ajax_init();
        });
      },
      add_url: function add_url(url) {
        var href = url.href;
        window.history.pushState({}, "", href);
      },
      modify_count: function modify_count(res) {
        $('.woocommerce-result-count').replaceWith(res.result_count_html);
      },
      prepare_active_filter: function prepare_active_filter(res) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        // console.log(res.active_filters);
        if (!res) {
          return null;
        }

        var $products = $('.site-main').find('>.products');
        var filters_array = [];
        var allowed_filters = ['filter_product_cat', 'filter_product_brand', 'min_price', 'max_price', 'rating'];
        res.active_filters.forEach(function (filter) {
          // console.log(filter);
          if (allowed_filters.includes(filter.param) || filter.param.match('filter_')) {
            filter.values.forEach(function (value) {
              // console.log(value);
              filters_array.push('<li><span data-param="' + filter.param + '" data-value="' + value.id + '">' + value.name + '</span></li>');
            });
          }
        });

        if ($('.agni-product-active-filters').length) {
          $('.agni-product-active-filters').html(filters_array);
        } else {
          var $active_filters; // if (params) {
          //     console.log("params", params);
          //     $active_filters = $('<ul class="agni-product-active-filters" data-tax="' + JSON.stringify(JSON.parse(params)) + '">' + filters_array + '</ul>');
          // }
          // else {

          $active_filters = $('<ul class="agni-product-active-filters">' + filters_array + '</ul>'); // }

          $active_filters.attr('data-tax', JSON.stringify(params));
          $active_filters.insertBefore($products);
        }
      },
      pagination: function pagination(res) {
        if (!res) {
          return null;
        }

        var ele = $('.agni-woocommerce-pagination');

        if (parseInt(res.result_count) > 0) {
          ele.replaceWith(res.pagination);
        } else {
          ele.html('');
        } // $('.agni-woocommerce-pagination.has-ajax input[type="number"]').on('keyup', function (e) {
        //     //e.preventDefault();
        //     if (e.key === "Enter") {
        //         e.preventDefault();
        //         $.agni_product_pagination.onKeyup($(this).val());
        //     }
        // });

      },
      ajax_init: function ajax_init() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        // console.log(window.location);
        var url = new URL(window.location.href);

        if (!url.search) {
          return null;
        }

        $.agni_product_filter_loader_show();
        $.agni_product_filter_scroll_to_top(); // console.log("url", new URL(window.location.href));
        // console.log(url.searchParams.get('filter_product_cat'));
        // console.log(url.search.slice(1));

        var url_params = url.search.slice(1);
        var url_params_array = url_params.split('&'); // console.log("Param Array before Ajax: ", url_params_array);

        var keys = [];
        var values = [];
        url_params_array.forEach(function (param) {
          if (param.split('=')[1].length == 0) {
            url.searchParams["delete"](param.split('=')[0]);
            $.agni_product_filter.add_url(url);
          } else {
            keys.push(param.split('=')[0]);
          }
        }); // console.log("Param before Ajax: ", params);

        var data_params = [];
        params.forEach(function (param) {
          data_params.push({
            param: param['param'],
            values: param['value']
          });
        });
        keys.forEach(function (param) {
          values.push(url.searchParams.get(param));
          data_params.push({
            param: param,
            values: url.searchParams.get(param).split(',')
          });
        });
        var infinite = false;
        data_params.forEach(function (param) {
          if (param.param == 'infinite') {
            infinite = param.values[0];
          }
        }); // console.log("params", data_params);
        // console.log(keys, values, data_params);
        // var url = new URL(window.location.href);
        // var url_path = url.pathname;
        // if (url_path.match())

        var current_page = 1,
            href = url.href;
        var url_match_page = href.match(/.+\/page\/([0-9]+)+.*/g);
        var url_match_paged = href.match(/.+paged=([0-9]+)+.*/g);

        if (url_match_page) {
          current_page = href.replace(/.+\/page\/([0-9]+)+.*/g, "$1");
        } else if (url_match_paged) {
          current_page = href.replace(/.+paged=([0-9]+)+.*/g, "$1");
        } // console.log('Current Page :', current_page);
        // var data_params = {
        //     cat: url.searchParams.get('filter_product_cat')
        // }


        if (this.ajax_request && this.ajax_request.readyState != 4) {
          this.ajax_request.abort();
        }

        this.ajax_request = $.ajax({
          url: cartify_ajax_products_filter.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_products_filter'),
          type: 'get',
          data: {
            // action: 'agni_products_filter',
            current_page: current_page,
            current_url: url.toJSON(),
            params: data_params,
            security: cartify_ajax_products_filter.security // agni_ajax_search_text: $this.val(),
            // agni_ajax_search_category: $ajax_cat.val()

          },
          success: function success(res) {
            // var res = JSON.parse(res);
            // console.log(res);
            var $products = $('.site-main').find('>.products');
            $.agni_product_filter.modify_count(res); // console.log(window.location);

            if (infinite) {
              $products.append(res.content);
            } else {
              // $('.products').html(res);
              $products.html(res.content);
            }

            if (res.redirect_url != '') {
              var newUrl = new URL(res.redirect_url); // console.log("new url", newUrl);

              newUrl.search = url.search; // console.log("new url after search", newUrl);

              $.agni_product_filter.add_url(newUrl);
            }

            $.agni_product_filter.prepare_active_filter(res, params);

            if (!infinite) {
              $.agni_product_filter.pagination(res);
            }

            if (typeof wc_add_to_cart_variation_params !== 'undefined') {
              $('.variations_form').each(function () {
                $(this).wc_variation_form();
              });
            }

            $('.woocommerce-loop-product__thumbnail').not('.slick-initialized').each(function () {
              var $this = $(this);

              if ($this.hasClass('style-3') && $this.children().length > 1) {
                $.agni_scripts.archives_gallery_slider($this);
              }
            });
            $('.agni-sale-countdown').each(function () {
              $.agni_sale_countdown.init($(this));
            }); // console.log(res);

            $.agni_product_filter_loader_hide();
            $.agni_product_filter_active_handler(res.active_filters); // return res;
          }
        });
      }
    };

    $.agni_product_filter_loader_show = function () {
      var $this = $('.shop-page-products');
      $this.addClass('loading');
    };

    $.agni_product_filter_loader_hide = function () {
      var $this = $('.shop-page-products');
      $this.removeClass('loading');
    };

    $.agni_product_filter_scroll_to_top = function () {
      var $products = $('.shop-page-products');

      if ($products.length !== 0) {
        var scrollTopOffset = $('.agni-shop-control-bar').offset().top;
        var duration = 500;
        $('html, body').stop().animate({
          scrollTop: scrollTopOffset
        }, duration);
      }
    };

    $.agni_product_filter_active_handler = function (active_filters) {
      // console.log(active_filters);
      var $cat = $('.agni-product-categories');
      var $cat_lis = $cat.find('li');
      var $brand_lis = $('.agni-product-brands').find('li');
      var $attributes_lis = $('.agni-product-attributes').find('li');
      var $rating_lis = $('.agni-product-ratings').find('li');
      var activeFilterArray = active_filters.map(function (a) {
        return a.param;
      });

      if (active_filters.length) {
        var paramsArray = ['filter_product_cat', 'filter_product_brand', 'rating']; // console.log("Params Array:", paramsArray);

        active_filters.forEach(function (filter) {
          var idsArray = filter.values.map(function (a) {
            return a.id;
          });
          $attributes_lis.each(function () {
            var $li = $(this);
            var url = $li.children('a').attr('href');
            var urlParam = url.split('?')[1];
            var filterParam = urlParam.split('=');

            if (activeFilterArray.includes(filterParam[0])) {
              // console.log(idsArray.includes(filterParam[1]));
              if (filter.param == filterParam[0]) {
                if (idsArray.includes(filterParam[1])) {
                  $li.addClass('active');
                } else {
                  $li.removeClass('active');
                }
              }
            }
          });

          if (paramsArray.includes(filter.param)) {
            if (filter.param == 'filter_product_cat') {
              var isShowChildrenOnly = $cat.hasClass('show-children-only') ? true : false;
              console.log(isShowChildrenOnly);
              $cat_lis.each(function () {
                var $li = $(this);
                var isChosen = idsArray.some(function (id) {
                  var classList = $li.attr("class").split(/\s+/);
                  return classList.includes('cat-item-' + id);
                });

                if (isChosen) {
                  $(this).addClass('active');

                  if (isShowChildrenOnly) {
                    $(this).siblings().addClass('hide'); // $(this).closest('li.cat-parent').addClass('hide-children')

                    $(this).parents('li.cat-parent').addClass('hide-children');
                    $(this).parents('li.cat-parent').siblings().addClass('hide');
                  }
                } else {
                  $(this).removeClass('active'); // $(this).siblings().removeClass('hide');
                }
              });
            }

            if (!activeFilterArray.includes('filter_product_cat')) {
              $cat_lis.removeClass('active hide hide-children');
            }

            if (filter.param == 'filter_product_brand') {
              $brand_lis.each(function () {
                var $li = $(this);
                var isChosen = idsArray.some(function (id) {
                  var classList = $li.attr("class").split(/\s+/);
                  return classList.includes('cat-item-' + id);
                });

                if (isChosen) {
                  $(this).addClass('active');
                } else {
                  $(this).removeClass('active');
                }
              });
            }

            if (!activeFilterArray.includes('filter_product_brand')) {
              $brand_lis.removeClass('active');
            }

            if (filter.param == 'rating') {
              $rating_lis.each(function () {
                var $li = $(this);
                var url = $li.children('a').attr('href');
                var urlParam = url.split('?')[1];
                var filterParam = urlParam.split('=');

                if (filter.param == filterParam[0]) {
                  if (idsArray.includes(filterParam[1])) {
                    $li.addClass('active');
                  } else {
                    $li.removeClass('active');
                  }
                }
              });
            }

            if (!activeFilterArray.includes('rating')) {
              $rating_lis.removeClass('active');
            }
          }
        });
      } else {
        $cat_lis.removeClass('active hide hide-children');
        $brand_lis.removeClass('active');
        $attributes_lis.removeClass('active');
        $rating_lis.removeClass('active');
      } // console.log(activeFilterArray);


      if (!activeFilterArray.includes('min_price')) {
        $('.agni-product-price').each(function () {
          var minWidth = $(this).find('.min-price').attr('min');
          $.agni_product_filter_frontend.minPrice($(this), '0', minWidth);
        });
      }

      if (!activeFilterArray.includes('max_price')) {
        $('.agni-product-price').each(function () {
          var maxWidth = $(this).find('.max-price').attr('max');
          $.agni_product_filter_frontend.maxPrice($(this), '200', maxWidth);
        });
      }
    };

    $('.agni-product-categories').each(function () {
      var $lis = $(this).find('li');
      var isShowChildrenOnly = $(this).hasClass('show-children-only');
      $(this).find('.cat-back-link').on('click', function () {
        var $this = $(this); // var $li = $this.parent('li');

        var category_id = $this.data('cat-id') ? $this.data('cat-id').toString() : '';
        var url = new URL(window.location.href);
        $lis.each(function () {
          var $li = $(this);
          var classList = $li.attr("class").split(/\s+/); // if (category_id != '') {

          if (classList.includes('cat-item-' + category_id)) {
            $li.removeClass('hide');
          }

          ; // }
          // else {
          //     $li.removeClass('hide');
          // }
        });
        url.searchParams.set('filter_product_cat', category_id);
        $.agni_product_filter.add_url(url);

        if (false) {}
      });
      $(this).find('a').on('click', function (e) {
        e.preventDefault();
        var $this = $(this); // var $li = $this.parent('li');

        var category_id = $this.data('cat-id').toString();
        var $and = !isShowChildrenOnly ? true : false; // var url = window.location.href;
        // if ($li.hasClass('active')) {
        //     $li.removeClass('active');
        // }
        // else {
        //     $li.addClass('active');
        // }

        var url = new URL(window.location.href);
        var category_ids = category_id;

        if ($and) {
          var existing_category_ids = url.searchParams.get('filter_product_cat'); // console.log(existing_category_ids);

          if (existing_category_ids) {
            var category_ids_array = existing_category_ids.split(','); // console.log(category_ids_array)

            if (!category_ids_array.includes(category_id)) {
              category_ids_array.push(category_id);
            } else {
              category_ids_array = category_ids_array.filter(function (categoryid) {
                return category_id != categoryid;
              });
            }

            category_ids = category_ids_array.join(',');
          }
        } else {
          category_ids = category_id;
        }

        url.searchParams.set('filter_product_cat', category_ids); //new URLSearchParams(url.search.slice(1));
        // console.log(params, url);
        // console.log(category_id);
        // var url_param_category = 'cat=' + category_id;
        // console.log(window.location.search, );
        // if (!window.location.search) {
        // console.log("Not empty");
        // params.append('cat', category_id);
        // }
        // console.log("New Params:", new_url, url);

        $.agni_product_filter.add_url(url);

        if (!$('.shop-sidebar').hasClass('agni-filter-toggle-content') && window.innerWidth > 1024) {
          $.agni_product_filter.ajax_init();
        }
      });
    });
    $('.agni-product-brands').each(function () {
      var $brands = $(this),
          brand_names = [];
      brand_names = $brands.find('.agni-product-categories__cat-item a').map(function () {
        return this.innerText;
      }).get(); // $brands.find('a').text();

      var $input = $brands.find('input');
      $input.on('input', function () {
        var $val = $(this).val(),
            result_index = []; // brand_names.includes($val);

        brand_names.forEach(function (brand, index) {
          var valLower = $val.toLowerCase(),
              brandLower = brand.toLowerCase();

          if (brandLower.indexOf(valLower) > -1) {
            // console.log("Brand", brand, "Index:", index);
            result_index.push(index);
          }
        });
        $brands.find('.agni-product-categories__cat-item').each(function (index) {
          var $li = $(this);

          if (!result_index.includes(index)) {
            $li.addClass('hide');
          } else {
            $li.removeClass('hide');
          } // $(this).addClass('hide');
          // console.log(index, result_index, result_index.includes(index))

        });
      }); // console.log("Text:", brand_names);
    });
    $('.agni-product-brands a').on('click', function (e) {
      e.preventDefault();
      var $this = $(this);
      var data_tax = $this.closest('.agni-product-brands').data('tax');
      var $li = $this.parent('li');
      var category_id = $this.data('cat-id').toString();
      var $and = true; // var url = window.location.href;
      // if ($li.hasClass('active')) {
      //     $li.removeClass('active');
      // }
      // else {
      //     $li.addClass('active');
      // }

      var url = new URL(window.location.href);
      var category_ids = category_id;

      if ($and) {
        var existing_category_ids = url.searchParams.get('filter_product_brand'); // console.log(existing_category_ids);

        if (existing_category_ids) {
          var category_ids_array = existing_category_ids.split(','); // console.log(category_ids_array)

          if (!category_ids_array.includes(category_id)) {
            category_ids_array.push(category_id);
          } else {
            category_ids_array = category_ids_array.filter(function (categoryid) {
              return category_id != categoryid;
            });
          }

          category_ids = category_ids_array.join(',');
        }
      }

      url.searchParams.set('filter_product_brand', category_ids); //new URLSearchParams(url.search.slice(1));
      // console.log(params, url);
      // console.log(category_id);
      // var url_param_category = 'cat=' + category_id;
      // console.log(window.location.search, );
      // if (!window.location.search) {
      // console.log("Not empty");
      // params.append('cat', category_id);
      // }
      // console.log("New Params:", new_url, url);

      $.agni_product_filter.add_url(url);

      if (!$('.shop-sidebar').hasClass('agni-filter-toggle-content') && window.innerWidth > 1024) {
        $.agni_product_filter.ajax_init(data_tax);
      }
    });
    $('.agni-product-categories-taxonomy-toggle').on('click', function () {
      var $this = $(this);
      var $taxonomy = $this.siblings('.agni-product-categories-taxonomy');

      if (!$taxonomy.hasClass('active')) {
        $taxonomy.addClass('active');
        $this.addClass('active');
        $this.parent().css({
          'height': $this.outerHeight(true) + $taxonomy.outerHeight(true)
        });
      } else {
        $taxonomy.removeClass('active');
        $this.removeClass('active');
        $this.parent().css({
          'height': 'auto'
        });
      }
    });
    $('.agni-product-attributes, .agni-product-categories, .agni-product-categories-taxonomy').each(function () {
      var $ele = $(this); // isExpanded = $ul.hasClass('expanded');

      if (!$ele.data('limit')) {
        return null;
      }

      var limit = $ele.data('limit'),
          $ul = $ele.children('ul'),
          $lis = $ele.children('ul').children('li').slice(limit),
          $toggle = $ele.find('.list-toggle');

      if ($ul.children().length <= 5) {
        $toggle.remove();
      }

      $.toggleElements = function ($ele, $lis) {
        // console.log($lis.attr('class'));
        $ele.hasClass('more') ? $lis.removeClass('hide') : $lis.addClass('hide');
      };

      $toggle.on('click', function () {
        if ($ele.hasClass('more')) {
          $ele.removeClass('more');
          $.toggleElements($ele, $lis);
        } else {
          $ele.addClass('more');
          $.toggleElements($ele, $lis);
        }
      });
      $.toggleElements($ele, $lis);
    });
    $('.agni-product-attributes').each(function () {
      var $this = $(this);
      var data_tax = $this.data('tax');
      var $lis = $(this).find('li');
      var isQueryType = $this.data('query');
      $(this).find('a').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $li = $this.parent('li');
        var $and = isQueryType == 'and' ? true : false; // console.log($this.attr('href'));
        // if ($li.hasClass('active')) {
        //     $li.removeClass('active');
        // }
        // else {
        //     $li.addClass('active');
        // }

        var url = new URL($this.attr('href'));
        var param = url.search.slice(1);
        var param_query_type = param.split('&')[1];
        var param_attributes = param.split('&')[0];
        var attribute_values = param_attributes.split('=');
        var attribute = attribute_values[0].replace('filter_', '');
        var attribute_value = attribute_values[1]; // console.log(param, param_query_type, param_attributes, attribute_value, attribute);

        var actual_url = new URL(window.location.href);
        actual_url.searchParams.get('filter_' + attribute); // console.log("old url", new URL(window.location.href));
        // actual_url.searchParams.set('filter_' + attribute, attribute_value);

        var category_ids = attribute_value;

        if ($and) {
          var existing_category_ids = actual_url.searchParams.get('filter_' + attribute); // console.log(existing_category_ids);

          if (existing_category_ids) {
            var category_ids_array = existing_category_ids.split(','); // console.log(category_ids_array)

            if (!category_ids_array.includes(attribute_value)) {
              category_ids_array.push(attribute_value);
            } else {
              category_ids_array = category_ids_array.filter(function (categoryid) {
                return attribute_value != categoryid;
              });
            } // console.log(category_ids_array);


            category_ids = category_ids_array.join(',');
          }
        } else {
          category_ids = attribute_value;
        } // console.log(category_ids);


        actual_url.searchParams.set('filter_' + attribute, category_ids); //new URLSearchParams(url.search.slice(1));
        // console.log("new url", actual_url);

        $.agni_product_filter.add_url(actual_url);

        if (!$('.shop-sidebar').hasClass('agni-filter-toggle-content') && window.innerWidth > 1024) {
          $.agni_product_filter.ajax_init(data_tax);
        }
      });
    });
    $('.agni-product-price').each(function () {
      $(this).find('input').focus(function (e) {
        $(this).parent('div').addClass('focus');
      }).blur(function (e) {
        $(this).parent('div').removeClass('focus');
      });
    });
    $('.agni-product-price form').on('submit', function (e) {
      e.preventDefault(); // console.log("Price submitted");
      // console.log(e);

      var $this = $(this);
      var data_tax = $this.closest('.agni-product-price').data('tax'); // var min_price = $this.find('.min-price').val();
      // var max_price = $this.find('.max-price').val();
      // console.log(min_price, max_price);
      // console.log($this.serializeArray());

      var params = $this.serializeArray();
      var url = new URL(window.location.href);
      params.forEach(function (param) {
        url.searchParams.set(param.name, param.value);
      }); // console.log(url);

      $.agni_product_filter.add_url(url);

      if (!$('.shop-sidebar').hasClass('agni-filter-toggle-content') && window.innerWidth > 1024) {
        $.agni_product_filter.ajax_init(data_tax);
      }
    });
    $('.agni-product-ratings').each(function () {
      var $this = $(this);
      var data_tax = $this.closest('.agni-product-price').data('tax');
      var $lis = $(this).find('li');
      $(this).find('a').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $and = true;
        var url = new URL($this.attr('href'));
        var param = url.search.slice(1);
        var param_query_type = param.split('&')[1];
        var param_rating = param.split('&')[0];
        var param_rating_values = param_rating.split('=');
        var param_rating_value = param_rating_values[1]; // console.log(rating_values[1]);

        var actual_url = new URL(window.location.href); // console.log(actual_url.searchParams.get('rating'));

        var rating_value = param_rating_value;

        if ($and) {
          var existing_rating_values = actual_url.searchParams.get('rating'); // console.log(existing_category_ids);

          if (existing_rating_values) {
            var rating_values_array = existing_rating_values.split(','); // console.log(category_ids_array)

            if (!rating_values_array.includes(param_rating_value)) {
              rating_values_array.push(param_rating_value);
            } else {
              rating_values_array = rating_values_array.filter(function (ratingValue) {
                return param_rating_value != ratingValue;
              });
            } // console.log(category_ids_array);


            rating_value = rating_values_array.join(',');
          }
        } else {
          rating_value = param_rating_value;
        }

        actual_url.searchParams.set('rating', rating_value); //new URLSearchParams(url.search.slice(1));
        // console.log(actual_url);

        $.agni_product_filter.add_url(actual_url);

        if (!$('.shop-sidebar').hasClass('agni-filter-toggle-content') && window.innerWidth > 1024) {
          $.agni_product_filter.ajax_init(data_tax);
        }
      });
    });
    $('.shop-page-container').on('click', '.agni-product-active-filters span', function () {
      var $this = $(this);
      var data_tax = $this.closest('.agni-product-active-filters').data('tax'); // console.log('active filter');

      var filter_param = $this.data('param');
      var filter_value = $this.data('value'); // var url = new URL(window.location.href);
      // var url_params = new URLSearchParams(url.search.slice(1));

      var url = new URL(window.location.href);
      var url_params = url.search.slice(1);
      var url_params_array = url_params.split('&'); // console.log(URLSearchParams);
      // console.log(url, url_params, url_params_array);
      // console.log(filter_param, filter_value);
      // url_params_array.forEach(function (value, key) {
      // })

      var existing_filter_values = url.searchParams.get(filter_param).split(','); // if (existing_filter_values.includes(filter_value)) {
      //     var new_filter_values = 
      // }
      // console.log(filter_value, existing_filter_values);

      var new_filter_values = existing_filter_values.filter(function (value) {
        // console.log(filter_value, elem);
        return value != filter_value;
      }); // console.log(existing_filter_values, new_filter_values);

      url.searchParams.set(filter_param, new_filter_values);
      $.agni_product_filter.add_url(url);

      if (!$('.shop-sidebar').hasClass('agni-filter-toggle-content') && window.innerWidth > 1024) {
        $.agni_product_filter.ajax_init(data_tax);
      } // searchParams.forEach(function(value, key) {
      //     console.log(value, key);
      //   });

    });
    $.agni_product_pagination = {
      init: function init(new_page_url) {
        var url = new URL(new_page_url);
        $.agni_product_filter.add_url(url);
        $.agni_product_filter.ajax_init();
      },
      onKeyup: function onKeyup(new_page_num) {
        var href = window.location.href;
        var url_match_page = href.match(/([a-z]+.)\/[0-9]/g);
        var url_match_paged = href.match(/(paged=)+[0-9]/g);
        var new_page_url = href;

        if (url_match_page) {
          new_page_url = href.replace(/([a-z]+.)\/[0-9]/g, "$1" + '/' + new_page_num); // href.replace(/.+\/page\/([0-9]+)+.*/g, "$1");
        } else if (url_match_paged) {
          new_page_url = href.replace(/(paged=)+[0-9]/g, "$1" + new_page_num); // href.replace(/.+paged=([0-9]+)+.*/g, "$1");
        } else {
          if (new_page_num > 1) {
            var url = new URL(href);
            url.pathname = url.pathname + 'page/' + new_page_num + '/';
            new_page_url = url;
          }
        }

        $.agni_product_pagination.init(new_page_url);
      }
    };
    $('.shop-page-container').on('click', '.agni-woocommerce-pagination.has-ajax a:not(.agni-woocommerce-pagination-infinite)', function (e) {
      e.preventDefault();
      var $this = $(this);
      var new_page_url = $this.attr('href');
      $.agni_product_pagination.init(new_page_url);
    });
    $('.shop-page-container').on('keyup', '.agni-woocommerce-pagination.has-ajax input[type="number"]', function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        $.agni_product_pagination.onKeyup($(this).val());
      }
    });
    $('.shop-page-container').on('click', '.agni-woocommerce-pagination.has-ajax .agni-woocommerce-pagination-infinite', function (e) {
      // if (e.key === "Enter") {
      e.preventDefault();
      var options = $(this).data('infinite-options');
      var next_page_num = options['current'] + 1;
      var url = new URL(window.location.href);
      url.searchParams.set('infinite', true);
      $.agni_product_filter.add_url(url);
      $.agni_product_pagination.onKeyup(next_page_num); // console.log("infinite true")

      var $this = $('.agni-woocommerce-pagination-infinite');
      options['current'] = options['current'] + 1;
      $this.data('infinite-options', options);
      $this.removeClass('infinite-loading'); // console.log("opiotns", options)

      if (options['current'] < options['total']) {
        console.log("adding infinite autoload");
        $this.addClass('infinite-auto-load');
      } else {
        $this.remove();
      } // }

    });
    $(window).on('scroll', function () {
      if ($('.agni-woocommerce-pagination-infinite').hasClass('infinite-auto-load') && $('.agni-woocommerce-pagination').hasClass('has-ajax')) {
        var $this = $('.agni-woocommerce-pagination-infinite');
        var $products = $this.closest('.agni-woocommerce-pagination').siblings('.products');
        var products_end_position = $products.height() + $products.offset().top - $(window).height();

        if ($(document).scrollTop() > products_end_position) {
          $('.infinite-auto-load').trigger('click');
          $this.removeClass('infinite-auto-load');
        }
      }
    }); // initiate filter

    $.agni_product_filter.init();
    $.agni_product_filter_frontend = {
      price: function price(min_width, max_width) {
        var isDraggingMin = false,
            isDraggingMax = false,
            isOutofRange = false;
        var handleWidth = $('.agni-product-price-slider__handle').width(),
            sliderPosition = $('.agni-product-price-slider').offset();
        var minWidth = $('.agni-product-price-slider__handle--min').width(),
            maxWidth = $('.agni-product-price-slider__handle--max').width(); // console.log(handleWidth, "Position:", sliderPosition, "MinWidth:", minWidth, "Min_width:", min_width, "MaxWidth:", maxWidth, "Max_width:", max_width)

        var dataMinWidth = $('.agni-product-price form .min-price').attr('min'),
            dataMaxWidth = $('.agni-product-price form .max-price').attr('max'),
            range = dataMaxWidth - dataMinWidth; // $('.agni-product-price-slider__handle span').on('click', function (e) {
        //     e.preventDefault();
        //     e.stopPropagation();
        // });

        $('.agni-product-price-slider__handle--min').on('mouseup', function (e) {
          isDraggingMin = false;
          $('.agni-product-price form').trigger('submit');
        }).on('mousedown', function (e) {
          isDraggingMin = true;
        });
        $('.agni-product-price-slider__handle--max').on('mouseup', function (e) {
          isDraggingMax = false;
          $('.agni-product-price form').trigger('submit');
        }).on('mousedown', function (e) {
          isDraggingMax = true;
        });
        $(document).on('mousemove', function (e) {
          // console.log(handleWidth, "Position:", sliderPosition, "MinWidth:", minWidth, "Min_width:", min_width, "MaxWidth:", maxWidth, "Max_width:", max_width)
          var $this = $(this);
          var offsetX = e.offsetX;
          var pageX = e.pageX; // if (offsetX % 8 == 0) {

          isOutofRange = sliderPosition.left > pageX || handleWidth + sliderPosition.left <= pageX ? true : false;
          var width = Math.floor(range * offsetX / (2 * 100)) + parseFloat(dataMinWidth);

          if (isDraggingMax == true && minWidth < offsetX && isOutofRange == false) {
            // $this.find('.agni-product-price-slider__handle--max').css({ 'width': offsetX / 2 + '%' });
            // $('.agni-product-price-slider__range--max span').html(width);
            // $('.agni-product-price form .max-price').val(width);
            $.agni_product_filter_frontend.maxPrice($this, offsetX, width);
          }

          if (isDraggingMin == true && maxWidth > offsetX && isOutofRange == false) {
            // $this.find('.agni-product-price-slider__handle--min').css({ 'width': offsetX / 2 + '%' });
            // $('.agni-product-price-slider__range--min span').html(width);
            // $('.agni-product-price form .min-price').val(width);
            $.agni_product_filter_frontend.minPrice($this, offsetX, width);
          }

          minWidth = $('.agni-product-price-slider__handle--min').width();
          maxWidth = $('.agni-product-price-slider__handle--max').width(); // }
        }).on('mouseup', function (e) {
          isDraggingMin = false;
          isDraggingMax = false;
        }).on('mousedown', function (e) {
          if (e.which == 3) {
            isDraggingMin = false;
            isDraggingMax = false;
          }
        });
      },
      minPrice: function minPrice($this, offsetX, width) {
        // console.log($this, offsetX, width);
        $this.find('.agni-product-price-slider__handle--min').css({
          'width': offsetX / 2 + '%'
        });
        $('.agni-product-price-slider__range--min span').html(width);
        $('.agni-product-price form .min-price').val(width);
      },
      maxPrice: function maxPrice($this, offsetX, width) {
        // console.log($this, offsetX, width);
        $this.find('.agni-product-price-slider__handle--max').css({
          'width': offsetX / 2 + '%'
        });
        $('.agni-product-price-slider__range--max span').html(width);
        $('.agni-product-price form .max-price').val(width);
      }
    };

    if ($('.agni-product-price').length > 0) {
      $.agni_product_filter_frontend.price();
    }
  });
}(jQuery);

/***/ })

/******/ });