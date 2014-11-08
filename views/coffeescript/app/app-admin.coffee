((App,$,window)->
  App.admin = 
    form_edit_user: ()->
      $('#user-edit-form').on 'submit', (e)->
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
    form_add_user: ()->
      $('#user-add-form').on 'submit', (e)->
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
            window.location.href = '/admin/user/'
          true
        .fail (jqXHR, data)->
          $.msgGrowl
            type: 'error'
            title: 'Error'
            text: 'An error has occurred, please try again!'
          false
        false
      true
    form_enable_debug: ()->
      $('#debug-enable-form').on 'submit', (e)->
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
            $.msgGrowl
              type: 'success'
              title: 'Success'
              text: 'Successfully updated the debug mode!'
          true
        .fail (jqXHR, data)->
          $.msgGrowl
            type: 'error'
            title: 'Error'
            text: 'An error has occurred, please try again!'
          false
        false
      true
    disable_user: ()->
      $('.user-disable').on 'click', (e)->
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
          else if data.user_id
            $.msgGrowl
              type: 'success'
              title: 'Success'
              text: 'Successfully disabled the user!'
            $('#'+id.replace("disable","status")).html '<em class="disabled">Disable</em>'
          true
        .fail (jqXHR, data)->
          $.msgGrowl
            type: 'error'
            title: 'Error'
            text: 'An error has occurred, please try again!'
          false
        false
      true
    enable_user: ()->
      $('.user-enable').on 'click', (e)->
        e.preventDefault()
        $this = $ this
        id = $this.attr 'id'
        $.ajax
          type: 'PUT'
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
          else if data.user_id
            $.msgGrowl
              type: 'success'
              title: 'Success'
              text: 'Successfully enabled the user!'
            $('#'+id.replace("enable","status")).html '<em class="active">Active</em>'
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
      if $('#user-edit-form').length > 0
        this.form_edit_user()
      if $('#user-add-form').length > 0
        this.form_add_user()
      if $('.user-disable').length > 0
        this.disable_user()
      if $('.user-enable').length > 0
        this.enable_user()
      if $('#debug-enable-form').length > 0
        this.form_enable_debug()
      true
  true
)(App,jQuery,window)