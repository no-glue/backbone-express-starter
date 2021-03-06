var options = function(options) {
  // options used a lot

  if(!options) {
    options = {
      assure: assure,
      selector: $,
      navigate: function(url, params, sep, refresh, navigator) {
        // navigate to url

        if(!sep) sep = '/';

        if(params && params.length) {
          url = url + sep;

          for(var i = 0, len = params.length; i < len; i++) url += params[i] + sep;

          url = url.substring(0, url.length - 1);
        }

        if(!refresh) refresh = true;

        if(!navigator) navigator = Backbone.history;

        navigator.navigate(url, refresh);
      } 
    }
  }

  return options;
};