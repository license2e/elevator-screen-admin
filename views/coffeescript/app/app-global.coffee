((App,$,window)->
  App.global =
    validationRules: ()->
      this.getValidationRules()
    init: ()->
      this.enableBackToTop()
      #this.enableLightbox()
      #this.enableCirque()
      #this.enableEnhancedAccordion()
      this.enableFlashGrowl()
      App.signin.init()
      App.feed.init()
      App.setting.init()
      App.admin.init()
      true
    enableFlashGrowl: ()->
      if $('#flash-growl').length > 0
        $flash_growl = $('#flash-growl')
        type = $flash_growl.data('type')
        msg = $flash_growl.data('msg')
        $.msgGrowl
          type: type
          title: type.charAt(0).toUpperCase() + type.slice(1)
          text: msg
      true
    enableCirque: ()->
      if $.fn.lightbox
        $('.ui-lightbox').lightbox()
      true
    enableLightbox: ()->
      if $.fn.cirque
        $('.ui-cirque').cirque {}
      true
    enableBackToTop: ()->
      backToTop = $('<a>', { id:'back-to-top', href: '#top' })
      icon = $('<i>', { class: 'icon-chevron-up' })
      backToTop.appendTo 'body'
      icon.appendTo backToTop
      backToTop.hide()
      $(window).scroll ()->
        if $(this).scrollTop() > 150
          backToTop.fadeIn()
        else
          backToTop.fadeOut()
        true
      backToTop.click (e)->
        e.preventDefault()
        $('body, html').animate {scrollTop: 0}, 600
        false
      true
    enableEnhancedAccordion: ()->
      $('.accordion').on('show', (e)->
        $(e.target).prev('.accordion-heading').parent().addClass 'open'
        true
      )

      $('.accordion').on('hide', (e)->
        $(this).find('.accordion-toggle').not($(e.target)).parents('.accordion-group').removeClass 'open'
        true
      )

      $('.accordion').each( ()->
        $(this).find('.accordion-body.in').parent().addClass 'open'
        true
      )
      true
    getValidationRules: ()->
      custom =
        focusCleanup: false
        wrapper: 'div'
        errorElement: 'span'
        highlight: (element)->
          $(element).parents('.control-group').removeClass('success').addClass('error')
          true
        success: (element)->
          $(element).parents('.control-group').removeClass('error').addClass('success')
          $(element).parents('.controls:not(:has(.clean))').find('div:last').before('<div class="clean"></div>')
          true
        errorPlacement: (error, element)->
          error.appendTo element.parents('.controls')
          true
  $ ()->
    App.global.init()
    true
  true
)(App,jQuery,window)