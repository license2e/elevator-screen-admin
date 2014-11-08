((App,$,window)->
  App.signin = 
    init: ()->
      if $('#sigin-in').length > 0
        $('#sigin-in').on 'submit', (e)->
          e.preventDefault()
          $this = $ this
          $.ajax
            type: $this.attr 'method'
            data: $this.serialize()
            url: $this.attr 'action'
            dataType: 'json'
          .done (data)->
            if data.error
              $.msgGrowl
                type: 'error'
                title: 'Error'
                text: data.error
              true
            else if data.token
              window.location.href = '/'
            true
          .fail (jqXHR, data)->
            $.msgGrowl
              type: 'error'
              title: 'Error'
              text: 'An error has occurred, please try again!'
            false
          false
      true
  true
)(App,jQuery,window)