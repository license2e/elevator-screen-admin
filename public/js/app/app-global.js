// Generated by CoffeeScript 1.6.3
(function(App, $, window) {
  App.global = {
    validationRules: function() {
      return this.getValidationRules();
    },
    init: function() {
      this.enableBackToTop();
      this.enableFlashGrowl();
      App.signin.init();
      App.feed.init();
      App.setting.init();
      App.admin.init();
      return true;
    },
    enableFlashGrowl: function() {
      var $flash_growl, msg, type;
      if ($('#flash-growl').length > 0) {
        $flash_growl = $('#flash-growl');
        type = $flash_growl.data('type');
        msg = $flash_growl.data('msg');
        $.msgGrowl({
          type: type,
          title: type.charAt(0).toUpperCase() + type.slice(1),
          text: msg
        });
      }
      return true;
    },
    enableCirque: function() {
      if ($.fn.lightbox) {
        $('.ui-lightbox').lightbox();
      }
      return true;
    },
    enableLightbox: function() {
      if ($.fn.cirque) {
        $('.ui-cirque').cirque({});
      }
      return true;
    },
    enableBackToTop: function() {
      var backToTop, icon;
      backToTop = $('<a>', {
        id: 'back-to-top',
        href: '#top'
      });
      icon = $('<i>', {
        "class": 'icon-chevron-up'
      });
      backToTop.appendTo('body');
      icon.appendTo(backToTop);
      backToTop.hide();
      $(window).scroll(function() {
        if ($(this).scrollTop() > 150) {
          backToTop.fadeIn();
        } else {
          backToTop.fadeOut();
        }
        return true;
      });
      backToTop.click(function(e) {
        e.preventDefault();
        $('body, html').animate({
          scrollTop: 0
        }, 600);
        return false;
      });
      return true;
    },
    enableEnhancedAccordion: function() {
      $('.accordion').on('show', function(e) {
        $(e.target).prev('.accordion-heading').parent().addClass('open');
        return true;
      });
      $('.accordion').on('hide', function(e) {
        $(this).find('.accordion-toggle').not($(e.target)).parents('.accordion-group').removeClass('open');
        return true;
      });
      $('.accordion').each(function() {
        $(this).find('.accordion-body.in').parent().addClass('open');
        return true;
      });
      return true;
    },
    getValidationRules: function() {
      var custom;
      return custom = {
        focusCleanup: false,
        wrapper: 'div',
        errorElement: 'span',
        highlight: function(element) {
          $(element).parents('.control-group').removeClass('success').addClass('error');
          return true;
        },
        success: function(element) {
          $(element).parents('.control-group').removeClass('error').addClass('success');
          $(element).parents('.controls:not(:has(.clean))').find('div:last').before('<div class="clean"></div>');
          return true;
        },
        errorPlacement: function(error, element) {
          error.appendTo(element.parents('.controls'));
          return true;
        }
      };
    }
  };
  $(function() {
    App.global.init();
    return true;
  });
  return true;
})(App, jQuery, window);