((App,$,window)->
  App.setting = 
    form_setting_feed: ()->
      $('.setting-edit-form').on 'submit', (e)->
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
    get_location: ()->
      if navigator.geolocation
        $setting_lat = $ '#setting-lat'
        $setting_long = $ '#setting-long'
        navigator.geolocation.getCurrentPosition (position)->
          $setting_lat.val position.coords.latitude
          $setting_long.val position.coords.longitude
          true
        true 
      else
        #console.log 'not geo locaiton'
      true
    gmap_setup: ()->
      script = window.document.createElement "script"
      script.type = "text/javascript";
      script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCDuBjykEB4QNpYG2NSgcZYULsMEsR5HXk&sensor=true&v=3&callback=App.setting.form_setting_forecast";
      window.document.body.appendChild script
      true
    form_setting_forecast: ()->   
      $setting_lat = $ '#setting-lat'
      $setting_long = $ '#setting-long'
      ###
      $forecast_map = $ '#setting-forecast-map'
      google.maps.visualRefresh = true
      map_options =
        center: new google.maps.LatLng 37.037778, -95.626389
        zoom: 4
        mapTypeId: google.maps.MapTypeId.ROADMAP
      map = new google.maps.Map $forecast_map[0], map_options
      
      pos = new google.maps.LatLng position.coords.latitude, position.coords.longitude
      map.panTo pos
      map.setZoom 13
      marker = new google.maps.Marker
        position: pos
        map: map
        draggable: true
      google.maps.event.addListener marker, 'dragend', ()->
        map.panTo marker.getPosition()
      true
      ###
      if $setting_lat.val() == '' || $setting_long.val() == ''
        this.get_location()
      true
    form_location_refresh: ()->
      $('#setting-loc-refresh').on 'click', (e)->
        e.preventDefault()
        App.setting.get_location()
        false
      true
    init: ()->
      if $('.setting-edit-form').length > 0
        this.form_setting_feed()
      if $('#setting-forecast').length > 0
        #this.gmap_setup()
        this.form_setting_forecast()
      if $('#setting-loc-refresh').length > 0
        this.form_location_refresh()
      true
  true
)(App,jQuery,window)