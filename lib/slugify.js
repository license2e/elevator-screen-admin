exports.slugify = function(str, len) {
  var from  = "ąàáäâãåæćęèéëêìíïîłńòóöôõøśùúüûñçżź"
    , to    = "aaaaaaaaceeeeeiiiilnoooooosuuuunczz"
    , regex = new RegExp('[' + from.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1') + ']', 'g')
    , str_len = len || -1
    , return_str = '';

  if (undefined == str || null == str) return '';

  str = String(str).toLowerCase().replace(regex, function(c) {
    return to.charAt(from.indexOf(c)) || '-';
  });

  return_str = str.replace(/[^\w\s-]/g, '').replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
  if( str_len > 0 ){
    return_str = return_str.substring(0, str_len);
  }
  return return_str;
};