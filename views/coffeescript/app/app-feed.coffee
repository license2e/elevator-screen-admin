((App,$,window)->
  App.feed = 
    form_add_feed: ()->
      $('#feed-add-form').on 'submit', (e)->
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
          else if data.id
            window.location.href = '/feed/'
          true
        .fail (jqXHR, data)->
          $.msgGrowl
            type: 'error'
            title: 'Error'
            text: 'An error has occurred, please try again!'
          false
        false
      true
    delete_feed: ()->
      $('.feed-delete').on 'click', (e)->
        e.preventDefault()
        $this = $ this
        id = $this.attr 'id'
        $.ajax
          type: 'DELETE'
          data: 
            _csrf: $('#token_csrf').val()
          url: $this.attr 'href'
          dataType: 'json'
        .done (data)->
          if data.error
            $.msgGrowl
              type: 'error'
              title: 'Error'
              text: data.error
            true
          else if data.feed_id
            $.msgGrowl
              type: 'success'
              title: 'Success'
              text: 'Successfully deleted the feed item!'
            $('#'+id.replace('delete','row')).fadeOut 'slow', ()->
              $(this).remove()
          true
        .fail (jqXHR, data)->
          $.msgGrowl
            type: 'error'
            title: 'Error'
            text: 'An error has occurred, please try again!'
          false
        false
      true
    init: ()->
      if $('#feed-add-form').length > 0
        this.form_add_feed()
      if $('.feed-delete').length > 0
        this.delete_feed()
      true
  true
)(App,jQuery,window)