#!/usr/bin/env node

(function () {

  'use strict';

  var base_url = 'https://www.spriters-resource.com';

  var fs = require('fs'),
    request = require('sync-request'),
    cheerio = require('cheerio'),
    slugify = require('slugify'),
    https = require('https'),
    minimist = require('minimist');

  var getPage = function (url) {
    var content = request('GET', url).getBody();
    return cheerio.load(content);
  };

  var args = minimist(process.argv.slice(2), {
    alias: {
      s: 'search',
      g: 'get',
      h: 'help'
    }
  });

  var search = function (query) {
    var url = base_url + '/search/?c=-1&o%5B%5D=g&q=';
    var $ = getPage(url + encodeURIComponent(query));
    var total = 0;
    $('.gameiconheadertext').each(function(){
      total++;
      console.log($(this).text()+' - ' + $(this).closest('a').attr('href'));
    });
  };

  var get_sheets = function(url){
    if(url.indexOf('http://') == -1 && url.indexOf('https://') == -1) url = base_url + '/' + url;
    try {
      var $ = getPage(url);
      var links = $('a[href*="/sheet/"]');
      if(links.length==0) throw new Error();
      var output = {
        title:$('.gameiconheadertext').text(),
        sheets:[]
      };
      links.each(function(){
        var href = $(this).attr('href');
        var parts = href.split('/');
        var id = parts[parts.length-2];
        output.sheets.push({
          id:id,
          title:$(this).find('.iconheadertext').text()
        });
      });
      return output;
    }
    catch(e){
      return {title:'',data:[]};
    }
  };

  var download_sheets = function (sheets,destination) {
    destination = destination || process.cwd();
    var num = 0;

    sheets.forEach(function (sheet) {
      var url = base_url + '/download/'+sheet.id+'/';
      https.get(url, function(response) {
        var ext = (/.*".*\.(.*)";/g).exec(response.headers['content-disposition'])[1];
        var filename = destination + '/' + slugify(sheet.title) + '.' + ext;
        var file = fs.createWriteStream(filename);
        response.on("end", function() {
          num++;
          console.log('Downloaded '+num+' of '+sheets.length);
          file.end();
        });
        response.pipe(file);
      })
    });
  };

  if(args.search){
    search(args.search);
  } else if(args.get){
    download_sheets(get_sheets(args.get).sheets);
  } else {
    console.log("---\r\nspriters-resource.com downloader. Usage:\r\n---");
    console.log("Search for game links:\r\n    spriters --search=heroes\r\n---");
    console.log("Download sprites from link:\r\n    spriters --get=pc_computer/heroesofmightandmagic2");
  }
}());
